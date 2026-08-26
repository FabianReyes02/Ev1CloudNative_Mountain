import { ChevronDown, Shield, Thermometer, Droplets } from 'lucide-react';

export const HeroMountain = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-glacier-400 rounded-full animate-pulse" />
            <span className="text-slate-300 text-xs font-medium tracking-wider uppercase">
              Temporada 2026 — Nueva colección disponible
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-6">
            Conquistá los
            <br />
            <span className="text-gradient-glacier">extremos</span> con
            <br />
            <span className="text-gradient-thermal">tecnología real</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed">
            Equipamiento técnico probado en las cumbres más exigentes del mundo.
            Cada prenda supera 10,000 horas de testing en campo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a href="#catalog" className="btn-primary text-base">
              Ver Catálogo Técnico
            </a>
            <a href="#tech" className="btn-secondary text-base">
              Explorar Tecnología
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-md">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                <Shield className="w-4 h-4 text-thermal-500" />
                <span className="text-white font-bold text-xl">10K+</span>
              </div>
              <p className="text-slate-500 text-xs">Horas de Testing</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                <Thermometer className="w-4 h-4 text-glacier-400" />
                <span className="text-white font-bold text-xl">-30°C</span>
              </div>
              <p className="text-slate-500 text-xs">Rating Máximo</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                <Droplets className="w-4 h-4 text-glacier-400" />
                <span className="text-white font-bold text-xl">28K mm</span>
              </div>
              <p className="text-slate-500 text-xs">Impermeabilidad</p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#catalog"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-white transition-colors animate-float"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
};
