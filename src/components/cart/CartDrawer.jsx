import { useState } from 'react';
import {
  ArrowRight,
  Check,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/Toast';
import { cartService } from '../../services/api';
import { handleImageError } from '../../lib/placeholderImage';

const currency = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
});

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    totals,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const toast = useToast();
  const [placing, setPlacing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCheckout = async () => {
    setPlacing(true);
    try {
      const order = await cartService.create({
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: totals.subtotal,
      });
      toast(`Compra realizada con éxito. Pedido ${order.id}`);
      clearCart();
      closeCart();
    } catch (error) {
      toast(
        error.message === 'api_UNAUTHORIZED'
          ? 'Necesitas iniciar sesión para completar tu pedido.'
          : 'No se pudo procesar el pedido. Intenta nuevamente.',
        { type: 'error' }
      );
    } finally {
      setPlacing(false);
      setConfirmOpen(false);
    }
  };

  const closeAndBrowse = () => {
    closeCart();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <span className="relative">
              <ShoppingBag className="w-5 h-5 text-thermal-500" />
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-glacier-400 animate-pulse" />
            </span>
            <h3 className="text-white font-bold tracking-tight">
              Tu Carrito
            </h3>
            {totals.count > 0 && (
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                {totals.count} {totals.count === 1 ? 'artículo' : 'artículos'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-800/60">
              <ShoppingBag className="w-10 h-10 text-slate-600" />
              <span className="absolute inset-0 rounded-full border border-slate-700/60 animate-spin-slow" />
            </div>
            <div>
              <p className="text-white font-semibold">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-slate-400">
                Equipa tu próxima expedición con lo mejor del catálogo.
              </p>
            </div>
            <button onClick={closeAndBrowse} className="btn-primary text-sm">
              Explorar catálogo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="animate-fade-up flex gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImageError}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.membrane}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-slate-500 transition-colors hover:text-red-400"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 text-slate-400 transition-colors hover:text-white"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 text-slate-400 transition-colors hover:text-white"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-thermal-400">
                      {currency.format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="border-t border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white font-semibold">
                {currency.format(totals.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Envío</span>
              <span className="text-emerald-400 font-medium">
                Gratis sobre 300
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-slate-300 font-medium">Total</span>
              <span className="text-xl font-extrabold text-white">
                {currency.format(totals.subtotal)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            disabled={placing || items.length === 0}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Procesando pedido...
              </>
            ) : (
              <>
                Realizar pedido
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500">
            El carrito se sincroniza con el microservicio de órdenes al
            conectar el backend.
          </p>
        </footer>
      </aside>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar compra"
        >
          <button
            className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
            aria-label="Cerrar confirmación"
          />
          <div className="animate-scale-in relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/50">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-thermal-500/15">
                  <ShoppingBag className="h-4.5 w-4.5 text-thermal-500" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Confirmar compra
                  </h3>
                  <p className="text-xs text-slate-500">
                    Revisa tu pedido antes de continuar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmOpen(false)}
                className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Cerrar confirmación"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {totals.count} {totals.count === 1 ? 'artículo' : 'artículos'}
                </span>
                <span className="font-semibold text-white">
                  {currency.format(totals.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-300 font-medium">Total</span>
                <span className="text-lg font-extrabold text-white">
                  {currency.format(totals.subtotal)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={placing}
                className="btn-secondary flex-1 !py-2.5 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCheckout}
                disabled={placing}
                className="btn-primary flex-1 !py-2.5 text-sm"
              >
                {placing ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar compra
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};