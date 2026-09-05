import { useEffect, useRef } from 'react';
import {
  ChevronDown,
  Droplets,
  Flame,
  ShieldCheck,
  Snowflake,
  Thermometer,
} from 'lucide-react';

const HERO_PARALLAX_FACTOR = 0.22;

const stats = [
  {
    icon: ShieldCheck,
    value: '10,000+',
    label: 'Horas de testing',
    accent: 'text-thermal-500',
  },
  {
    icon: Thermometer,
    value: '-30°C',
    label: 'Rating máximo',
    accent: 'text-glacier-400',
  },
  {
    icon: Droplets,
    value: '28,000 mm',
    label: 'Columna de agua',
    accent: 'text-glacier-400',
  },
];

const marqueeItems = [
  'Hardshells',
  'Softshells',
  'Aislantes',
  'Capas base',
  'Calzado técnico',
  'Membranas GORE-TEX',
  'Testing en altura',
];

const particles = [
  { left: '6%', size: 5, duration: 17, delay: 0, drift: '30px' },
  { left: '14%', size: 3, duration: 23, delay: 3, drift: '-20px' },
  { left: '24%', size: 4, duration: 19, delay: 6, drift: '40px' },
  { left: '33%', size: 2, duration: 26, delay: 1, drift: '-30px' },
  { left: '42%', size: 5, duration: 20, delay: 8, drift: '24px' },
  { left: '52%', size: 3, duration: 22, delay: 4, drift: '-18px' },
  { left: '61%', size: 4, duration: 18, delay: 9, drift: '36px' },
  { left: '70%', size: 2, duration: 25, delay: 2, drift: '-26px' },
  { left: '78%', size: 5, duration: 21, delay: 5, drift: '28px' },
  { left: '86%', size: 3, duration: 24, delay: 7, drift: '-32px' },
  { left: '93%', size: 4, duration: 19, delay: 1, drift: '22px' },
  { left: '10%', size: 2, duration: 28, delay: 10, drift: '18px' },
];

export const HeroMountain = () => {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = backgroundRef.current;
      if (!el) return;
      const offset = window.scrollY;
      if (offset < window.innerHeight) {
        el.style.transform = `translate3d(0, ${offset * HERO_PARALLAX_FACTOR}px, 0)`;
      }
    };

    const listener = () => window.requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div ref={backgroundRef} className="absolute inset-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=85"
          alt="Paisaje de montaña"
          className="h-full w-full object-cover animate-kenburns"
          fetchPriority="high"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-slate-950/35" />

        <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-glacier-500/20 blur-3xl animate-aurora" />
        <div
          className="absolute bottom-16 -right-24 h-[30rem] w-[30rem] rounded-full bg-thermal-500/15 blur-3xl animate-aurora"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[5]">
        {particles.map((p, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white/80 animate-drift"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                '--drift-x': p.drift,
              }
            }
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="animate-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-2 backdrop-blur-md">
              <span className="flex h-2 w-2">
                <span className="h-2 w-2 rounded-full bg-glacier-400 animate-ping" />
              </span>
              <span className="h-2 w-2 -ml-2 rounded-full bg-glacier-400" />
              <span className="text-xs font-medium tracking-wider text-slate-300 uppercase">
                Temporada 2026 — Nueva colección
              </span>
            </div>

            <h1
              className="animate-fade-up font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '120ms' }}
            >
              Conquista los
              <br />
              <span className="text-gradient-glacier">extremos</span> con
              <br />
              <span className="text-gradient-thermal">tecnología real</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-slate-300 sm:text-xl"
              style={{ animationDelay: '240ms' }}
            >
              Equipamiento técnico probado en las cumbres más exigentes del
              mundo. Cada prenda supera 10,000 horas de testing en campo.
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: '360ms' }}
            >
              <a href="#catalog" className="btn-primary text-base glow-thermal">
                Ver catálogo
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </a>
              <a href="#tech" className="btn-secondary text-base">
                <Flame className="w-4 h-4 text-thermal-400" />
                Nuestra tecnología
              </a>
            </div>

            <div
              className="animate-fade-up mt-14 grid max-w-md grid-cols-3 gap-4"
              style={{ animationDelay: '480ms' }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm"
                >
                  <stat.icon className={`mb-1.5 w-5 h-5 ${stat.accent}`} />
                  <p className="font-display text-lg font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 animate-fade-in border-t border-white/10 bg-slate-950/40 backdrop-blur-sm">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex w-max">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-10 py-3.5 pr-10"
              >
                {marqueeItems.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.2em] text-slate-400"
                  >
                    {item}
                    <Snowflake className="h-3.5 w-3.5 text-glacier-400/60" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#catalog"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-slate-400 transition-colors hover:text-white sm:block animate-float"
        aria-label="Ir al catálogo"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
};