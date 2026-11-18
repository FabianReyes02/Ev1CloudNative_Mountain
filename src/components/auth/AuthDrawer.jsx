import { useState } from "react";
import {
  ArrowRight,
  LoaderCircle,
  LogOut,
  MountainSnow,
  UserPlus,
  X,
} from "lucide-react";
import { authService } from "../../services/api";

export const AuthDrawer = ({ isOpen, onClose, onAuthenticated, user }) => {
  const [modo, setModo] = useState("login"); // 'login' | 'registro'
  const [campos, setCampos] = useState({ email: "", password: "", name: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const actualizar = (campo) => (event) =>
    setCampos((prev) => ({ ...prev, [campo]: event.target.value }));

  const enviar = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const sesion =
        modo === "login"
          ? await authService.login({
              email: campos.email,
              password: campos.password,
            })
          : await authService.register({
              email: campos.email,
              password: campos.password,
              name: campos.name,
            });
      onAuthenticated(sesion.user ?? null);
      onClose();
    } catch (error) {
      const texto = error.message || "No se pudo iniciar sesión.";
      setStatus({
        type: "error",
        message: /400|401/.test(texto)
          ? "Correo o contraseña incorrectos."
          : modo === "login"
            ? "No se pudo iniciar sesión. Intenta nuevamente."
            : "No se pudo crear la cuenta (¿correo ya registrado?).",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const enviarAzure = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await authService.login();
    } catch (error) {
      const message = error.message || "No se pudo iniciar sesión con Azure.";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Autenticación"
    >
      <button
        className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar autenticación"
      />
      <aside className="animate-slide-down relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 px-6 py-8 shadow-2xl shadow-black/50 sm:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MountainSnow className="h-7 w-7 text-thermal-500" />
            <div className="leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SUMMIT<span className="text-thermal-500">LAB</span>
              </span>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Área de explorador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-900 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user ? (
          <div className="flex flex-1 flex-col justify-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-thermal-500">
              Sesión activa
            </p>
            <h2 className="font-display text-3xl font-bold text-white">
              Hola, {user.name}
            </h2>
            <p className="mt-3 text-slate-400">
              Tu cuenta está lista para guardar equipamiento y sincronizar tus
              pedidos.
            </p>
            <button
              onClick={() => {
                authService.logout().catch(() => {});
                localStorage.removeItem("summitlab_token");
                localStorage.removeItem("summitlab_user");
                onAuthenticated(null);
                onClose();
              }}
              className="btn-secondary mt-8 w-full"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-glacier-400">
              {modo === "login" ? "Inicia tu expedición" : "Únete a la cumbre"}
            </p>
            <h2 className="font-display text-3xl font-bold text-white">
              {modo === "login" ? "Vuelve a la cumbre" : "Crea tu cuenta"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {modo === "login"
                ? "Ingresa con tu correo y contraseña para sincronizar tus pedidos."
                : "Regístrate para guardar tu equipo favorito y tramitar pedidos."}
            </p>

            <form onSubmit={enviar} className="mt-7 space-y-4">
              {status.message && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {status.message}
                </p>
              )}
              {modo === "registro" && (
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Nombre
                  </span>
                  <input
                    type="text"
                    value={campos.name}
                    onChange={actualizar("name")}
                    placeholder="Alex Cumbre"
                    autoComplete="name"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-thermal-500"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Correo
                </span>
                <input
                  type="email"
                  value={campos.email}
                  onChange={actualizar("email")}
                  placeholder="tu@correo.cl"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-thermal-500"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Contraseña
                </span>
                <input
                  type="password"
                  value={campos.password}
                  onChange={actualizar("password")}
                  placeholder="••••••••"
                  autoComplete={modo === "login" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-thermal-500"
                />
              </label>
              <button
                disabled={submitting}
                className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : modo === "login" ? (
                  <ArrowRight className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {submitting
                  ? "Procesando..."
                  : modo === "login"
                    ? "Ingresar"
                    : "Crear cuenta"}
              </button>
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-800" />
                <span className="text-xs uppercase tracking-widest text-slate-600">
                  o
                </span>
                <span className="h-px flex-1 bg-slate-800" />
              </div>
              <button
                type="button"
                onClick={enviarAzure}
                disabled={submitting}
                className="btn-secondary w-full disabled:cursor-wait disabled:opacity-60"
              >
                <svg viewBox="0 0 23 23" className="h-4 w-4" aria-hidden="true">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                  <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                  <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                  <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                </svg>
                Ingresar con Microsoft
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              {modo === "login" ? "¿Sin cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                onClick={() => {
                  setModo(modo === "login" ? "registro" : "login");
                  setStatus({ type: "", message: "" });
                }}
                className="font-semibold text-thermal-500 transition-colors hover:text-thermal-400"
              >
                {modo === "login" ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>

            <p className="mt-8 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-400">Cuenta demo:</span>{" "}
              demo@summitlab.cl · demo1234
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};
