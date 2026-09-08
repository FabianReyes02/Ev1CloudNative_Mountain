import { useState } from "react";
import {
  ArrowRight,
  LoaderCircle,
  LogOut,
  MountainSnow,
  X,
} from "lucide-react";
import { authService } from "../../services/api";

const initialForm = { name: "", email: "", password: "" };

export const AuthDrawer = ({ isOpen, onClose, onAuthenticated, user }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      const response =
        mode === "login"
          ? await authService.login(payload)
          : await authService.register(payload);
      localStorage.setItem("summitlab_token", response.token);
      localStorage.setItem("summitlab_user", JSON.stringify(response.user));
      onAuthenticated(response.user);
      onClose();
    } catch (error) {
      const message =
        error.status === 401
          ? "Correo o contraseña incorrectos."
          : error.status === 409
            ? "Ese correo ya tiene una cuenta registrada."
            : error.message?.startsWith("api_error_")
              ? "No se pudo conectar con el servicio de usuarios."
              : error.message || "No se pudo completar la solicitud.";
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
              Acceso seguro
            </p>
            <h2 className="font-display text-3xl font-bold text-white">
              {mode === "login" ? "Vuelve a la cumbre" : "Únete a Summit Lab"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {mode === "login"
                ? "Ingresa para continuar con tu equipo de montaña."
                : "Crea tu cuenta y lleva tus expediciones siempre contigo."}
            </p>

            <div className="mt-8 grid grid-cols-2 border-b border-slate-800">
              {["login", "register"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setMode(tab);
                    setStatus({ type: "", message: "" });
                  }}
                  className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${mode === tab ? "border-thermal-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                  {tab === "login" ? "Ingresar" : "Crear cuenta"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-7 space-y-4">
              {mode === "register" && (
                <label className="block text-sm text-slate-300">
                  Nombre
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    className="auth-input"
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </label>
              )}
              <label className="block text-sm text-slate-300">
                Correo electrónico
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  className="auth-input"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Contraseña
                <input
                  required
                  minLength={6}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  className="auth-input"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </label>
              {status.message && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {status.message}
                </p>
              )}
              <button
                disabled={submitting}
                className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {submitting
                  ? "Procesando..."
                  : mode === "login"
                    ? "Ingresar a mi cuenta"
                    : "Crear mi cuenta"}
              </button>
            </form>
          </div>
        )}
      </aside>
    </div>
  );
};
