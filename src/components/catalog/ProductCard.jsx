import { useState } from 'react';
import {
  Check,
  Droplets,
  Heart,
  Plus,
  ShieldCheck,
  Thermometer,
  Weight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/Toast';
import { handleImageError } from '../../lib/placeholderImage';

const currency = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
});

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();
  const toast = useToast();

  const handleAdd = (event) => {
    event.stopPropagation();
    addItem(product);
    toast(`${product.name} agregado al carrito.`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-thermal-500/50 hover:shadow-2xl hover:shadow-thermal-500/10">
      <div className="relative h-72 overflow-hidden bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="absolute left-3 top-3 rounded-md bg-thermal-500 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-950 shadow-sm">
          {product.membrane}
        </span>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/50 backdrop-blur-sm transition-all active:scale-90 ${
            isLiked ? 'text-thermal-500' : 'text-slate-300 hover:bg-slate-950/80'
          }`}
          aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? 'fill-thermal-500 animate-pop' : ''
            }`}
          />
        </button>

        <div className="absolute bottom-3 right-3 z-10 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(event) => {
              event.stopPropagation();
              toast(`${product.name} agregado al carrito.`);
              addItem(product);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-slate-200 backdrop-blur-sm transition-all hover:bg-thermal-500 hover:text-slate-950 active:scale-90"
            aria-label={`Agregar ${product.name} rápidamente`}
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-300 backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-thermal-400">
            {product.name}
          </h3>
          <span className="shrink-0 text-lg font-bold text-thermal-400">
            {currency.format(product.price)}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {product.description}
        </p>

        <div className="grid grid-cols-3 gap-2 border-y border-slate-800 py-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-thermal-500" />
            <span>{product.tempRating}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-glacier-400" />
            <span>{product.waterproof}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Weight className="h-4 w-4 text-slate-500" />
            <span>{product.weight}</span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
            added
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-thermal-500 text-slate-950 hover:bg-thermal-400 hover:shadow-lg hover:shadow-thermal-500/20'
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 animate-pop" />
              Agregado
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Equiparse
            </>
          )}
        </button>

        <button
          onClick={openCart}
          className="mt-2 text-center text-[11px] font-medium text-slate-500 transition-colors hover:text-glacier-400"
        >
          Ver carrito y tramitar pedido
        </button>
      </div>
    </article>
  );
};