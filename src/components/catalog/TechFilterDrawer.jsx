import { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Thermometer,
  Droplets,
  ChevronDown,
  RotateCcw,
  Check,
} from 'lucide-react';

export const TechFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  tempRanges,
  waterproofRanges,
  membraneTypes,
}) => {
  const [expandedSection, setExpandedSection] = useState({
    temp: true,
    waterproof: true,
    membrane: true,
  });

  const toggleSection = (section) => {
    setExpandedSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const tempValue = filters.tempRange || null;
  const waterproofValue = filters.waterproofRange || null;
  const membraneValue = filters.membrane || null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-80 flex-col rounded-l-2xl bg-slate-900 border-l border-slate-800 shadow-2xl shadow-slate-950/60 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-thermal-500" />
            <h3 className="text-white font-semibold">Filtros Técnicos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
          <div>
            <button
              onClick={() => toggleSection('temp')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-thermal-500" />
                <span className="text-white text-sm font-medium">
                  Rango de Temperatura
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  expandedSection.temp ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSection.temp && (
              <div className="space-y-2 pl-6">
                {tempRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() =>
                      onFilterChange(
                        'tempRange',
                        tempValue === range.id ? null : range.id
                      )
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all border ${
                      tempValue === range.id
                        ? 'bg-thermal-500/15 border-thermal-500/40 text-thermal-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <span>{range.label}</span>
                    <span className="text-xs opacity-70">
                      {range.min}°C a {range.max}°C
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('waterproof')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-glacier-400" />
                <span className="text-white text-sm font-medium">
                  Impermeabilidad
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  expandedSection.waterproof ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSection.waterproof && (
              <div className="space-y-2 pl-6">
                {waterproofRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() =>
                      onFilterChange(
                        'waterproofRange',
                        waterproofValue === range.id ? null : range.id
                      )
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all border ${
                      waterproofValue === range.id
                        ? 'bg-glacier-500/15 border-glacier-500/40 text-glacier-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <span>{range.label}</span>
                    {waterproofValue === range.id && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('membrane')}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="text-white text-sm font-medium">
                Tipo de Membrana
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  expandedSection.membrane ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSection.membrane && (
              <div className="space-y-2 pl-6">
                {membraneTypes.map((membrane) => (
                  <button
                    key={membrane}
                    onClick={() =>
                      onFilterChange(
                        'membrane',
                        membraneValue === membrane ? null : membrane
                      )
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all border ${
                      membraneValue === membrane
                        ? 'bg-thermal-500/15 border-thermal-500/40 text-thermal-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <span>{membrane}</span>
                    {membraneValue === membrane && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-slate-800 bg-slate-900">
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="btn-secondary flex-1 !py-2.5 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex-1 !py-2.5 text-sm"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
