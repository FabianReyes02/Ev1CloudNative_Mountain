import { ShieldCheck, Thermometer, Droplets, Weight, Heart } from 'lucide-react';
import { useState } from 'react';

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:border-thermal-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-thermal-500/10 hover:shadow-2xl">
      <div className="relative h-72 overflow-hidden bg-slate-800">
        <span className="absolute top-3 left-3 z-10 bg-thermal-500 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded uppercase tracking-wider">
          {product.membrane || 'Gore-Tex Pro'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-slate-950/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-slate-950/80"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'text-thermal-500 fill-thermal-500' : 'text-slate-400'
            }`}
          />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-semibold text-lg tracking-tight">
              {product.name}
            </h3>
            <span className="text-thermal-400 font-bold text-lg">
              ${product.price}
            </span>
          </div>
          <p className="text-slate-400 text-xs mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 my-4 border-t border-b border-slate-800 py-3">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-thermal-500" />
              <span>{product.tempRating || '-20°C'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-glacier-400" />
              <span>{product.waterproof || '28,000 mm'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Weight className="w-4 h-4 text-slate-500" />
              <span>{product.weight || '400g'}</span>
            </div>
          </div>

          <button className="btn-primary w-full !py-3">
            <ShieldCheck className="w-4 h-4" />
            Equiparse
          </button>
        </div>
      </div>
    </div>
  );
};
