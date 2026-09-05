/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CircleCheck, CircleAlert, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastSeed = 0;

const toastStyles = {
  success: {
    icon: <CircleCheck className="w-5 h-5 text-emerald-400" />,
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-500/10',
  },
  info: {
    icon: <Info className="w-5 h-5 text-glacier-400" />,
    border: 'border-glacier-500/30',
    ring: 'ring-glacier-500/10',
  },
  error: {
    icon: <CircleAlert className="w-5 h-5 text-red-400" />,
    border: 'border-red-500/30',
    ring: 'ring-red-500/10',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    window.clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    (message, { type = 'success', duration = 3800 } = {}) => {
      const id = ++toastSeed;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-20 right-4 sm:right-6 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 pointer-events-none"
      >
        {toasts.map((item) => {
          const style = toastStyles[item.type] ?? toastStyles.success;
          return (
            <div
              key={item.id}
              className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border bg-slate-900/95 p-4 shadow-xl backdrop-blur-xl ring-1 ${style.border} ${style.ring}`}
            >
              <span className="mt-0.5 shrink-0">{style.icon}</span>
              <p className="flex-1 text-sm text-slate-200 leading-snug">
                {item.message}
              </p>
              <button
                onClick={() => dismiss(item.id)}
                className="shrink-0 text-slate-500 transition-colors hover:text-white"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};