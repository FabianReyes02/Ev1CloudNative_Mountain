import { useEffect, useState } from 'react';
import { Menu, MountainSnow, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/Toast';

const navLinks = [
  { label: 'Catálogo', href: '#catalog' },
  { label: 'Tecnología', href: '#tech' },
  { label: 'Actividades', href: '#activities' },
];

export const NavbarTech = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#catalog');
  const { totals, openCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      const position = window.scrollY + 120;
      let current = navLinks[0].href;
      for (const link of navLinks) {
        const el = document.getElementById(link.href.slice(1));
        if (el && el.offsetTop <= position) current = link.href;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAuth = () => {
    toast('El inicio de sesión Azure AD se conectará en la integración del backend.', {
      type: 'info',
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-slate-950/40'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          <a href="#top" className="group flex items-center gap-2.5">
            <div className="relative">
              <MountainSnow className="w-7 h-7 text-thermal-500 transition-transform duration-300 group-hover:-translate-y-0.5" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-glacier-400 rounded-full animate-pulse" />
            </div>
            <div className="leading-none">
              <span className="font-display text-white font-bold text-lg tracking-tight">
                SUMMIT<span className="text-thermal-500">LAB</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Alpine Store
              </p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  active === link.href
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 bg-thermal-500 rounded-full transition-all duration-300 ${
                    active === link.href ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() =>
                toast('Buscar en el catálogo estará disponible pronto.', {
                  type: 'info',
                })
              }
              className="p-2 text-slate-400 transition-all hover:text-white hover:bg-slate-800/80 rounded-lg active:scale-95"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={handleAuth}
              className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/60 px-3.5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-glacier-500/40 hover:text-glacier-300 active:scale-[0.97]"
            >
              <UserRound className="w-4 h-4" />
              Ingresar
            </button>

            <button
              onClick={openCart}
              className="relative p-2 text-slate-400 transition-all hover:text-white hover:bg-slate-800/80 rounded-lg active:scale-95"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {totals.count > 0 && (
                <span
                  key={totals.count}
                  className="animate-cart-pop absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-thermal-500 px-1 text-[11px] font-bold text-slate-950 shadow-md shadow-thermal-500/30"
                >
                  {totals.count}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 transition-colors hover:text-white"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-slide-down bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/60">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-slate-300 transition-colors rounded-lg hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={handleAuth}
                className="btn-secondary flex-1 !py-2.5 text-sm"
              >
                <UserRound className="w-4 h-4" /> Ingresar
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCart();
                }}
                className="btn-primary flex-1 !py-2.5 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Carrito
                {totals.count > 0 && ` (${totals.count})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};