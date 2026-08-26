import { useState, useMemo } from 'react';
import { SlidersHorizontal, Grid3X3, LayoutGrid, Search } from 'lucide-react';
import { NavbarTech } from './components/layout/NavbarTech';
import { FooterAlpine } from './components/layout/FooterAlpine';
import { HeroMountain } from './components/home/HeroMountain';
import { ActivityFilter } from './components/home/ActivityFilter';
import { ProductCard } from './components/catalog/ProductCard';
import { TechFilterDrawer } from './components/catalog/TechFilterDrawer';
import {
  mockProducts,
  activities,
  tempRanges,
  membraneTypes,
  waterproofRanges,
} from './data/mockProducts';

function App() {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(3);
  const [filters, setFilters] = useState({
    tempRange: null,
    waterproofRange: null,
    membrane: null,
  });

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
    return mockProducts.filter((product) => {
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
  }, [selectedActivities, filters, searchQuery]);

  const activeFilterCount =
    (filters.tempRange ? 1 : 0) +
    (filters.waterproofRange ? 1 : 0) +
    (filters.membrane ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <NavbarTech />
      <HeroMountain />

      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-thermal-500 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Catálogo Técnico
            </h2>
          </div>
          <p className="text-slate-400 max-w-xl ml-4">
            Cada pieza supera rigorosos estándares de rendimiento. Filtra por
            especificaciones técnicas exactas para encontrar tu equipamiento
            ideal.
          </p>
        </div>

        <div id="activities" className="mb-8">
          <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-wider">
            Filtrar por Actividad
          </h3>
          <ActivityFilter
            activities={activities}
            selected={selectedActivities}
            onToggle={toggleActivity}
          />
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, membrana..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-thermal-500/50 transition-colors"
              />
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                activeFilterCount > 0
                  ? 'bg-thermal-500/15 border-thermal-500/40 text-thermal-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros Técnicos
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-thermal-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm hidden sm:block">
              {filteredProducts.length} productos
            </span>
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setGridCols(2)}
                className={`p-2 transition-colors ${
                  gridCols === 2
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 transition-colors ${
                  gridCols === 3
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div
            className={`grid gap-6 ${
              gridCols === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-600" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Sin resultados
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              No se encontraron productos con los filtros seleccionados. Intenta
              ajustar los parámetros.
            </p>
            <button onClick={resetFilters} className="btn-secondary text-sm">
              Limpiar Filtros
            </button>
          </div>
        )}
      </section>

      <section
        id="tech"
        className="bg-slate-900/50 border-y border-slate-800/50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-glacier-400 uppercase tracking-wider">
                Tecnología de Membrana
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Protección Extrema,{' '}
              <span className="text-gradient-glacier">Ingeniería Real</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Cada membrana tiene un propósito específico. Entender las
              especificaciones técnicas es clave para elegir el equipamiento
              correcto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Gore-Tex Pro',
                subtitle: 'Máxima Protección',
                temp: '-30°C',
                wp: '28,000 mm',
                desc: 'Triple capa con micropartículas de ePTFE. Para las condiciones más hostiles del planeta.',
                color: 'thermal',
              },
              {
                title: 'Gore-Tex Active',
                subtitle: 'Transpirabilidad Total',
                temp: '-12°C',
                wp: '20,000 mm',
                desc: 'Construcción simplificada con membrana unida. Máxima respirabilidad para actividad intensa.',
                color: 'glacier',
              },
              {
                title: 'NeoShell',
                subtitle: 'Ventilación Activa',
                temp: '-5°C',
                wp: '15,000 mm',
                desc: 'Micro-porosa activa con permeabilidad al aire. Equilibrio perfecto entre protección y ventilación.',
                color: 'thermal',
              },
            ].map((tech) => (
              <div
                key={tech.title}
                className="card-tech p-6 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      tech.color === 'thermal'
                        ? 'text-thermal-500'
                        : 'text-glacier-400'
                    }`}
                  >
                    {tech.subtitle}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  {tech.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {tech.desc}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Rating Térmico</p>
                    <p className="text-white font-bold">{tech.temp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Impermeabilidad</p>
                    <p className="text-white font-bold">{tech.wp}</p>
                  </div>
                </div>
              </div>
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
