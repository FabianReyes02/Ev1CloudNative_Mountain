import { mockProducts } from '../data/mockProducts';
import {
  JWT_EXPECTED_AUDIENCES,
  JWT_EXPECTED_ISSUERS,
  JWT_REQUIRED_SCOPES,
  describeTokenReason,
  verifyToken,
} from '../lib/token';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const AUTH_STORAGE_KEY = 'summitlab.auth.v1';
const LEGACY_TOKEN_KEY = 'summitlab_token';
const LEGACY_USER_KEY = 'summitlab_user';

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const base64UrlEncode = (value) =>
  window
    .btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const readSession = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredSession = () => {
  const session = readSession();
  if (session) return session;
  // Compatibilidad con la sesión Azure (claves legacy summitlab_token/user).
  try {
    const token = window.localStorage.getItem(LEGACY_TOKEN_KEY);
    if (!token) return null;
    const rawUser = window.localStorage.getItem(LEGACY_USER_KEY);
    return { token, user: rawUser ? JSON.parse(rawUser) : null, azure: true };
  } catch {
    return null;
  }
};

export const getStoredToken = () =>
  readSession()?.token ?? window.localStorage.getItem(LEGACY_TOKEN_KEY) ?? null;

export const setStoredSession = (session) => {
  try {
    if (!session) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_TOKEN_KEY);
      window.localStorage.removeItem(LEGACY_USER_KEY);
    } else {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      // Espejo legacy para el flujo Azure existente.
      if (session.token) window.localStorage.setItem(LEGACY_TOKEN_KEY, session.token);
      if (session.user) window.localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(session.user));
    }
  } catch {
    // sin almacenamiento disponible
  }
};

export const clearStoredSession = () => setStoredSession(null);

/** Limpieza del caché de MSAL (cuentas + tokens). Sin esto, al recargar la
 * página `prepareAzureAuth` restaura la sesión aunque se haya cerrado. */
export const clearMsalCache = () => {
  try {
    const doomed = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('msal.')) doomed.push(key);
    }
    doomed.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // sin almacenamiento disponible
  }
};

/** Verificación client-side de la sesión guardada (sin validar firma). */
export const verifyStoredToken = (overrides) => {
  const session = getStoredSession();
  const result = verifyToken(session?.token, overrides);
  return { session, ...result, message: result.valid ? null : describeTokenReason(result.reason) };
};

export const isAuthenticated = (overrides) =>
  verifyStoredToken(overrides).valid;

// Carga perezosa de MSAL: azureAuth.js lanza si faltan las env de Azure,
// así el modo mock/local sigue funcionando sin configurar Entra ID.
const loadAzure = () => import('./azureAuth');

const azureRefresh = async () => {
  try {
    const azure = await loadAzure();
    const session = await azure.refreshToken();
    return session;
  } catch {
    return null;
  }
};

const doRequest = async (path, { method = 'GET', body, headers, token } = {}) => {
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
};

const parseErrorBody = async (response) => {
  try {
    const data = await response.clone().json();
    if (data && typeof data.error === 'string') return data.error;
    if (data && typeof data.message === 'string') return data.message;
  } catch {
    // no es JSON
  }
  return null;
};

const request = async (path, { method = 'GET', body, headers } = {}) => {
  let token = getStoredToken();
  let response = await doRequest(path, { method, body, headers, token });

  if ((response.status === 401 || response.status === 403) && !USE_MOCK) {
    const fresh = await azureRefresh().catch(() => null);
    if (fresh?.token) {
      token = fresh.token;
      setStoredSession({ token: fresh.token, user: fresh.user ?? null, azure: true });
      response = await doRequest(path, { method, body, headers, token });
    }
  }

  if (response.status === 401 || response.status === 403) {
    const detail = await parseErrorBody(response);
    const error = new Error('api_UNAUTHORIZED');
    error.status = response.status;
    error.detail = detail;
    // Si el backend rechaza el token y no es un intento de login/registro,
    // la sesión local ya no sirve: se limpia para forzar re-login.
    if (response.status === 401 && !path.startsWith('/auth/')) {
      clearStoredSession();
    }
    throw error;
  }

  if (!response.ok) {
    const detail = await parseErrorBody(response);
    const errorBody = detail ? { error: detail } : null;
    const error = new Error(errorBody?.error ?? `api_error_${response.status}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

const buildMockSession = (email, name) => {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: 'mock-1',
      iss: JWT_EXPECTED_ISSUERS[0] ?? 'pedidos360-usuarios',
      aud: JWT_EXPECTED_AUDIENCES[0] ?? 'pedidos360-api',
      iat: nowSec,
      exp: nowSec + 8 * 3600,
      email,
      name: name ?? email.split('@')[0],
      roles: 'CLIENTE',
      scp: JWT_REQUIRED_SCOPES[0] ?? 'orders.write',
    }),
  );
  return {
    token: `${header}.${payload}.mock-signature`,
    tokenType: 'Bearer',
    expiresIn: 8 * 3600,
    user: {
      id: 1,
      name: name ?? email.split('@')[0],
      email,
      roles: ['CLIENTE'],
    },
    mock: true,
  };
};

export const authService = {
  // Login local (email/password) o Azure (sin argumentos, redirect MSAL).
  login: async (credentials) => {
    if (credentials?.email) {
      const { email, password } = credentials;
      if (USE_MOCK) {
        await delay(420);
        if (!email || !password) throw new Error('api_error_400');
        const session = buildMockSession(email.trim().toLowerCase());
        setStoredSession(session);
        return session;
      }
      const session = await request('/auth/ingreso', {
        method: 'POST',
        body: { email, password },
      });
      setStoredSession(session);
      return session;
    }
    const azure = await loadAzure();
    return azure.loginWithAzure();
  },

  register: async ({ email, password, name }) => {
    if (USE_MOCK) {
      await delay(520);
      if (!email || !password) throw new Error('api_error_400');
      const session = buildMockSession(email.trim().toLowerCase(), name);
      setStoredSession(session);
      return session;
    }
    const session = await request('/auth/registro', {
      method: 'POST',
      body: { email, password, name },
    });
    setStoredSession(session);
    return session;
  },

  loginWithAzure: async () => {
    const azure = await loadAzure();
    return azure.loginWithAzure();
  },

  logout: () => {
    // Limpieza inmediata y síncrona: la UI responde al tiro aunque el
    // popup de MSAL se cuelgue o lo bloqueen (antes eso dejaba la sesión).
    clearStoredSession();
    clearMsalCache();
    // Intento de logout en Azure en segundo plano, con tope de 3s.
    loadAzure()
      .then((azure) =>
        Promise.race([azure.logoutFromAzure().catch(() => {}), delay(3000)]),
      )
      .catch(() => {
        // Azure no configurado: basta con la limpieza local ya hecha.
      });
  },

  getSession: () => getStoredSession(),
};

export const productService = {
  list: async () => {
    if (USE_MOCK) {
      await delay(420);
      return mockProducts;
    }
    const data = await request('/products');
    return Array.isArray(data) ? data : data.products;
  },

  get: async (id) => {
    if (USE_MOCK) {
      await delay(240);
      return mockProducts.find((p) => p.id === Number(id)) ?? null;
    }
    return request(`/products/${id}`);
  },
};

export const cartService = {
  create: async (payload) => {
    if (USE_MOCK) {
      await delay(520);
      // En modo mock también se exige sesión válida para probar el flujo real.
      const check = verifyStoredToken();
      if (!check.valid) {
        const error = new Error('api_UNAUTHORIZED');
        error.status = 401;
        error.detail = check.message;
        throw error;
      }
      return { id: `PEDIDO-${String(Date.now()).slice(-6)}` };
    }
    return request('/orders', { method: 'POST', body: payload });
  },
};

export { describeTokenReason, verifyToken };
