import { useState } from 'react';
import { Mountain, Menu, X, ShoppingCart, Search, User } from 'lucide-react';

export const NavbarTech = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Catálogo', href: '#catalog' },
    { label: 'Tecnología', href: '#tech' },
    { label: 'Actividades', href: '#activities' },
    { label: 'Guía de Capas', href: '#layers' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Mountain className="w-7 h-7 text-thermal-500" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-glacier-400 rounded-full animate-pulse" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              SUMMIT<span className="text-thermal-500">LAB</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-thermal-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <User className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-thermal-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button className="btn-primary !py-2 !px-4 text-sm">
              Equiparse
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button className="btn-secondary flex-1 !py-2.5 text-sm">
                <User className="w-4 h-4" /> Cuenta
              </button>
              <button className="btn-primary flex-1 !py-2.5 text-sm">
                <ShoppingCart className="w-4 h-4" /> Carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
