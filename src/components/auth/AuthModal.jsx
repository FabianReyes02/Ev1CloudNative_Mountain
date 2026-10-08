import { useState } from 'react';
import { LoaderCircle, LogIn, ShieldCheck, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

const formatCountdown = (remainingSec) => {
  if (!Number.isFinite(remainingSec) || remainingSec <= 0) return 'expirado';
  const hours = Math.floor(remainingSec / 3600);
  const minutes = Math.floor((remainingSec % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${remainingSec}s`;
};

const friendlyError = (error) => {
  if (error?.message === 'api_UNAUTHORIZED') {
    return error.detail ?? 'Credenciales inválidas o sesión rechazada.';
  }
  if (error?.message === 'api_error_400') {
    return error.detail ?? 'Revisa el email y la contraseña (mínimo 6 caracteres).';
  }
  if (typeof error?.detail === 'string' && error.detail.length > 0) {
    return error.detail;
  }
  return 'No se pudo completar la operación. Intenta nuevamente.';
};

export const AuthModal = () => {
  const {
    authModalOpen,
    authModalMode: mode,
    setAuthModalMode: setMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    isAuthenticated,
    tokenStatus,
    user,
  } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (mode === 'login') {
        await login({ email, password });
        toast('Sesión iniciada. Token verificado en el navegador.');
      } else {
        await register({ email, password, name });
        toast('Cuenta creada. Token verificado en el navegador.');
      }
      setPassword('');
    } catch (error) {
      setFormError(friendlyError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        onClick={closeAuthModal}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />
      <div className="animate-scale-in relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-glacier-400" />
            <h3 className="font-display text-lg font-bold text-white">
              {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar autenticación"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5">
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            {[
              { id: 'login', label: 'Ingresar', icon: LogIn },
              { id: 'register', label: 'Crear cuenta', icon: UserPlus },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMode(tab.id);
                  setFormError(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  mode === tab.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre (opcional)"
                autoComplete="name"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-glacier-500/50 focus:outline-none"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@summitlab.cl"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-glacier-500/50 focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña (mínimo 6 caracteres)"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-glacier-500/50 focus:outline-none"
            />
            {formError && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : mode === 'login' ? (
                'Ingresar y verificar token'
              ) : (
                'Registrar y verificar token'
              )}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verificación en el navegador
            </p>
            {isAuthenticated ? (
              <div className="space-y-1 text-xs text-slate-300">
                <p>
                  <span className="text-emerald-400 font-semibold">Token válido</span>
                  {user?.email ? ` · ${user.email}` : ''}
                </p>
                <p className="text-slate-400">
                  Expira en {formatCountdown(tokenStatus.remainingSec)} · scope:{' '}
                  {(tokenStatus.scopes ?? []).join(', ') || '—'}
                </p>
                <p className="text-slate-500">
                  La firma se valida en AWS / servicio-pedidos, aquí solo se
                  revisa estructura, vigencia, emisor, audiencia y permisos.
                </p>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-400">
                {tokenStatus.message ??
                  'Sin sesión. Al ingresar se guardará el JWT y se verificará expiración, emisor, audiencia y scope antes de llamar a /orders.'}
              </p>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-500">
            {mode === 'login' ? '¿Sin cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => openAuthModal(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-glacier-300 hover:text-glacier-200"
            >
              {mode === 'login' ? 'Crea una aquí' : 'Ingresa aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
