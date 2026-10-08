/**
 * Verificación client-side del JWT (defensa en UX, no sustituye la
 * validación criptográfica del backend / AWS API Gateway).
 *
 * Replica la lógica de `FiltroValidacionJwt` de servicio-pedidos:
 * expiración, nbf, iss, aud, scopes y roles. La firma NO se verifica aquí:
 * el secreto HS256 nunca debe exponerse al navegador y el JWKS RS256 de
 * Azure se valida en el gateway + microservicio.
 */

const SKEW_SEC = 30;

const csv = (value) =>
  String(value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

export const JWT_EXPECTED_ISSUERS = csv(
  import.meta.env.VITE_JWT_ISSUERS ?? 'pedidos360-usuarios',
);

export const JWT_EXPECTED_AUDIENCES = csv(
  import.meta.env.VITE_JWT_AUDIENCES ?? 'pedidos360-api',
);

export const JWT_REQUIRED_SCOPES = csv(
  import.meta.env.VITE_JWT_REQUIRED_SCOPES ?? 'orders.write',
);

export const JWT_REQUIRED_ROLES = csv(
  import.meta.env.VITE_JWT_REQUIRED_ROLES ?? '',
);

const base64UrlDecode = (segment) => {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const decodeJwtPart = (segment) => {
  if (!segment) return null;
  try {
    return JSON.parse(base64UrlDecode(segment));
  } catch {
    return null;
  }
};

export const decodeJwtPayload = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  return decodeJwtPart(parts[1]);
};

export const decodeJwtHeader = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  return decodeJwtPart(parts[0]);
};

const collectScopes = (claims = {}) => {
  const scopes = new Set();
  for (const key of ['scp', 'scope', 'scopes']) {
    const value = claims[key];
    if (Array.isArray(value)) {
      for (const item of value) scopes.add(String(item));
    } else if (typeof value === 'string') {
      for (const part of value.split(/\s+/)) {
        if (part) scopes.add(part);
      }
    } else if (value != null) {
      scopes.add(String(value));
    }
  }
  return [...scopes];
};

const collectRoles = (claims = {}) => {
  const value = claims.roles ?? claims.role ?? claims.appRoles ?? [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  if (value != null) return [String(value)];
  return [];
};

/** Igual que `esPermiso` del backend: exacto o sufijo `/requerido`. */
const matchesPermission = (tokenScope, required) => {
  if (!tokenScope || !required) return false;
  return tokenScope
    .trim()
    .split(/\s+/)
    .some((part) => part === required || part.endsWith(`/${required}`));
};

export const verifyToken = (token, overrides = {}) => {
  const expectedIssuers =
    overrides.expectedIssuers ?? JWT_EXPECTED_ISSUERS;
  const expectedAudiences =
    overrides.expectedAudiences ?? JWT_EXPECTED_AUDIENCES;
  const requiredScopes = overrides.requiredScopes ?? JWT_REQUIRED_SCOPES;
  const requiredRoles = overrides.requiredRoles ?? JWT_REQUIRED_ROLES;
  const nowSec = Math.floor(Date.now() / 1000);

  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'MISSING', claims: null };
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'MALFORMED', claims: null };
  }
  const header = decodeJwtPart(parts[0]);
  const claims = decodeJwtPart(parts[1]);
  if (!header || !claims) {
    return { valid: false, reason: 'MALFORMED', claims: null };
  }

  const exp = Number(claims.exp);
  if (!Number.isFinite(exp)) {
    return { valid: false, reason: 'MALFORMED', claims, header };
  }
  if (exp <= nowSec - SKEW_SEC) {
    return {
      valid: false,
      reason: 'EXPIRED',
      claims,
      header,
      expiresAt: new Date(exp * 1000),
      remainingSec: exp - nowSec,
    };
  }
  const nbf = Number(claims.nbf);
  if (Number.isFinite(nbf) && nbf > nowSec + SKEW_SEC) {
    return { valid: false, reason: 'NOT_YET_VALID', claims, header };
  }

  if (expectedIssuers.length > 0) {
    const iss = claims.iss ? String(claims.iss) : '';
    if (!expectedIssuers.includes(iss)) {
      return { valid: false, reason: 'INVALID_ISSUER', claims, header };
    }
  }

  if (expectedAudiences.length > 0) {
    const audiences = Array.isArray(claims.aud)
      ? claims.aud.map(String)
      : claims.aud != null
        ? [String(claims.aud)]
        : [];
    const ok = audiences.some((aud) => expectedAudiences.includes(aud));
    if (!ok) {
      return { valid: false, reason: 'INVALID_AUDIENCE', claims, header };
    }
  }

  const scopes = collectScopes(claims);
  const roles = collectRoles(claims);
  if (requiredScopes.length > 0) {
    const ok = requiredScopes.some((required) =>
      scopes.some((scope) => matchesPermission(scope, required)),
    );
    if (!ok) {
      return {
        valid: false,
        reason: 'FORBIDDEN_SCOPE',
        claims,
        header,
        scopes,
        roles,
      };
    }
  }
  if (requiredRoles.length > 0) {
    const ok = requiredRoles.some((required) => roles.includes(required));
    if (!ok) {
      return {
        valid: false,
        reason: 'FORBIDDEN_ROLE',
        claims,
        header,
        scopes,
        roles,
      };
    }
  }

  return {
    valid: true,
    reason: null,
    claims,
    header,
    scopes,
    roles,
    expiresAt: new Date(exp * 1000),
    remainingSec: exp - nowSec,
    // Recordatorio explícito: el navegador no verifica la firma.
    signatureVerified: false,
  };
};

export const isTokenExpired = (token, skewSec = SKEW_SEC) => {
  const claims = decodeJwtPayload(token);
  if (!claims || !Number.isFinite(Number(claims.exp))) return true;
  return Number(claims.exp) <= Math.floor(Date.now() / 1000) - skewSec;
};

export const getTokenRemainingSec = (token) => {
  const claims = decodeJwtPayload(token);
  if (!claims || !Number.isFinite(Number(claims.exp))) return 0;
  return Number(claims.exp) - Math.floor(Date.now() / 1000);
};

export const describeTokenReason = (reason) => {
  switch (reason) {
    case 'MISSING':
      return 'No hay sesión activa. Inicia sesión para continuar.';
    case 'MALFORMED':
      return 'El token guardado está corrupto. Vuelve a iniciar sesión.';
    case 'EXPIRED':
      return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    case 'NOT_YET_VALID':
      return 'El token aún no es válido. Revisa la hora del dispositivo.';
    case 'INVALID_ISSUER':
      return 'El emisor del token no es de confianza.';
    case 'INVALID_AUDIENCE':
      return 'El token no es para esta API.';
    case 'FORBIDDEN_SCOPE':
      return 'Tu cuenta no tiene el permiso orders.write.';
    case 'FORBIDDEN_ROLE':
      return 'Tu cuenta no tiene el rol requerido.';
    default:
      return 'Sesión no válida.';
  }
};
