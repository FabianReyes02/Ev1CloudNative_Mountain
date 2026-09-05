import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Grid3X3,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { NavbarTech } from './components/layout/NavbarTech';
import { FooterAlpine } from './components/layout/FooterAlpine';
import { HeroMountain } from './components/home/HeroMountain';
import { ActivityFilter } from './components/home/ActivityFilter';
import { ProductCard } from './components/catalog/ProductCard';
import { TechFilterDrawer } from './components/catalog/TechFilterDrawer';
import { CartDrawer } from './components/cart/CartDrawer';
import { Reveal } from './components/ui/Reveal';
import { productService } from './services/api';
import {
  activities,
  membraneTypes,
  tempRanges,
  waterproofRanges,
} from './data/mockProducts';

const technologyCards = [
  {
    title: 'Gore-Tex Pro',
    subtitle: 'Máxima Protección',
    temp: '-30°C',
    wp: '28,000 mm',
    desc: 'Triple capa con micropartículas de ePTFE. Para las condiciones más hostiles del planeta.',
    accent: 'thermal',
  },
  {
    title: 'Gore-Tex Active',
    subtitle: 'Transpirabilidad Total',
    temp: '-12°C',
    wp: '20,000 mm',
    desc: 'Construcción simplificada con membrana unida. Máxima respirabilidad para actividad intensa.',
    accent: 'glacier',
  },
  {
    title: 'NeoShell',
    subtitle: 'Ventilación Activa',
    temp: '-5°C',
    wp: '15,000 mm',
    desc: 'Micro-porosa activa con permeabilidad al aire. Equilibrio perfecto entre protección y ventilación.',
    accent: 'thermal',
  },
];

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
    <div className="placeholder-shimmer h-72" />
    <div className="space-y-3 p-5">
      <div className="placeholder-shimmer h-5 w-3/4 rounded" />
      <div className="placeholder-shimmer h-3 w-full rounded" />
      <div className="placeholder-shimmer h-3 w-2/3 rounded" />
      <div className="placeholder-shimmer h-9 w-full rounded-lg" />
    </div>
  </div>
);

function App() {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(3);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tempRange: null,
    waterproofRange: null,
    membrane: null,
  });

  useEffect(() => {
    let cancelled = false;
    productService
      .list()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleActivity = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ tempRange: null, waterproofRange: null, membrane: null });
    setSelectedActivities([]);
    setSearchQuery('');
  };

  const parseTemp = (tempStr) => {
    const match = tempStr.match(/-?\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const parseWaterproof = (wpStr) => {
    const match = wpStr.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        selectedActivities.length > 0 &&
        !product.activity.some((a) => selectedActivities.includes(a))
      ) {
        return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.membrane.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (filters.tempRange) {
        const range = tempRanges.find((r) => r.id === filters.tempRange);
        if (range) {
          const temp = parseTemp(product.tempRating);
          if (temp < range.min || temp > range.max) return false;
        }
      }

      if (filters.waterproofRange) {
        const range = waterproofRanges.find(
          (r) => r.id === filters.waterproofRange
        );
        if (range) {
          const wp = parseWaterproof(product.waterproof);
          if (range.id === 'basic') {
            if (wp >= 8000) return false;
          } else if (range.id === 'ultra') {
            if (wp < 25000) return false;
          } else if (range.id === 'high') {
            if (wp < 15000 || wp >= 25000) return false;
          } else if (range.id === 'medium') {
            if (wp < 8000 || wp >= 15000) return false;
          }
        }
      }

      if (filters.membrane && product.membrane !== filters.membrane) {
        return false;
      }

      return true;
    });
  }, [products, selectedActivities, filters, searchQuery]);

  const activeFilterCount =
    (filters.tempRange ? 1 : 0) +
    (filters.waterproofRange ? 1 : 0) +
    (filters.membrane ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <CartDrawer />
      <NavbarTech />
      <HeroMountain />

      <section id="catalog" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-thermal-500 glow-thermal" />
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Catálogo Técnico
              </h2>
            </div>
            <p className="ml-4 max-w-xl text-slate-400">
              Cada pieza supera rigurosos estándares de rendimiento. Filtra por
              especificaciones técnicas exactas para encontrar tu equipamiento
              ideal.
            </p>
          </div>
        </Reveal>

        <div id="activities" className="mb-8 scroll-mt-24">
          <Reveal delay={80}>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
              Filtrar por Actividad
            </h3>
            <ActivityFilter
              activities={activities}
              selected={selectedActivities}
              onToggle={toggleActivity}
            />
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, membrana..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-glacier-500/50 focus:outline-none sm:w-72"
                />
              </div>

              <button
                onClick={() => setDrawerOpen(true)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${
                  activeFilterCount > 0
                    ? 'border-thermal-500/40 bg-thermal-500/15 text-thermal-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros Técnicos
                {activeFilterCount > 0 && (
                  <span
                    key={activeFilterCount}
                    className="animate-cart-pop flex h-5 w-5 items-center justify-center rounded-full bg-thermal-500 text-xs font-bold text-slate-950"
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:block">
                {filteredProducts.length} productos
              </span>
              <div className="flex overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 transition-colors ${
                    gridCols === 2
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Dos columnas"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 transition-colors ${
                    gridCols === 3
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Tres columnas"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div
            className={`grid gap-6 ${
              gridCols === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={`grid gap-6 ${
              gridCols === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredProducts.map((product, index) => (
              <Reveal key={product.id} delay={(index % 6) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                <Search className="h-7 w-7 text-slate-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Sin resultados
              </h3>
              <p className="mx-auto mb-6 max-w-sm text-sm text-slate-400">
                No se encontraron productos con los filtros seleccionados.
                Intenta ajustar los parámetros.
              </p>
              <button onClick={resetFilters} className="btn-secondary text-sm">
                Limpiar Filtros
              </button>
            </div>
          </Reveal>
        )}
      </section>

      <section className="relative overflow-hidden py-28">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop&q=85"
          alt="Montañas nevadas bajo las estrellas"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-thermal-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-glacier-300">
                Todo listo para escalar
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              ¿Listo para tu próxima{' '}
              <span className="text-gradient-aurora animate-gradient-x">
                expedición
              </span>
              ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-slate-300">
              Regístrate para guardar tu equipo favorito, sincronizar tu pedido
              y acceder a tarifas exclusivas de la comunidad Summit Lab.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="btn-primary text-base">
                Crear cuenta
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#catalog" className="btn-secondary text-base">
                Explorar equipamiento
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="tech"
        className="relative border-y border-slate-800/50 bg-slate-900/50 py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-4 py-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-glacier-400">
                  Tecnología de Membrana
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Protección Extrema,{' '}
                <span className="text-gradient-glacier">Ingeniería Real</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Cada membrana tiene un propósito específico. Entender las
                especificaciones técnicas es clave para elegir el equipamiento
                correcto.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {technologyCards.map((tech, index) => (
              <Reveal key={tech.title} delay={index * 120}>
                <div className="group card-tech relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-600">
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                      tech.accent === 'thermal'
                        ? 'bg-thermal-500/25'
                        : 'bg-glacier-500/25'
                    }`}
                  />
                  <p
                    className={`mb-2 text-xs font-bold uppercase tracking-wider ${
                      tech.accent === 'thermal'
                        ? 'text-thermal-500'
                        : 'text-glacier-400'
                    }`}
                  >
                    {tech.subtitle}
                  </p>
                  <h3 className="font-display mb-3 text-xl font-bold text-white">
                    {tech.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">
                    {tech.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">
                        Rating Térmico
                      </p>
                      <p className="font-bold text-white">{tech.temp}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500">
                        Impermeabilidad
                      </p>
                      <p className="font-bold text-white">{tech.wp}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FooterAlpine />

      <TechFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        tempRanges={tempRanges}
        waterproofRanges={waterproofRanges}
        membraneTypes={membraneTypes}
      />
    </div>
  );
}

export default App;