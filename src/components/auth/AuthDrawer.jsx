import { useState } from "react";
import {
  ArrowRight,
  LoaderCircle,
  LogOut,
  MountainSnow,
  X,
} from "lucide-react";
import { authService } from "../../services/api";

export const AuthDrawer = ({ isOpen, onClose, onAuthenticated, user }) => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const submit = async (event) => {
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
              Acceso seguro con Azure
            </p>
            <h2 className="font-display text-3xl font-bold text-white">
              Vuelve a la cumbre
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Ingresa con tu cuenta de Microsoft para continuar con tu equipo de
              montaña.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
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
                {submitting ? "Procesando..." : "Ingresar con Microsoft"}
              </button>
            </form>
          </div>
        )}
      </aside>
    </div>
  );
};
