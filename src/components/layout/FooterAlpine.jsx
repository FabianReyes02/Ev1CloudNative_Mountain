import { Mountain, Mail, MapPin, Phone } from 'lucide-react';

export const FooterAlpine = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Mountain className="w-7 h-7 text-thermal-500" />
              <span className="text-white font-bold text-lg tracking-tight">
                SUMMIT<span className="text-thermal-500">LAB</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Equipamiento técnico para los extremos. Cada producto supera 10,000
              horas de testing en campo antes de llegar a tus manos.
            </p>
            <div className="flex gap-3">
              {['X', 'IG', 'YT', 'FB'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Categorías
            </h4>
            <ul className="space-y-3">
              {[
                'Hardshells',
                'Aislantes',
                'Softshells',
                'Capas Base',
                'Calzado Técnico',
                'Accesorios',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-thermal-400 text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Soporte
            </h4>
            <ul className="space-y-3">
              {[
                'Guía de Tallas',
                'Guía de Capas',
                'Cuidado del Equipamiento',
                'Garantía Vitalicia',
                'Reparaciones',
                'Envíos y Devoluciones',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-thermal-400 text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-glacier-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-sm">
                  Av. Montaña 4750, Barrio Alpino
                  <br />
                  Mendoza, Argentina
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-glacier-400 shrink-0" />
                <span className="text-slate-400 text-sm">+54 261 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-glacier-400 shrink-0" />
                <span className="text-slate-400 text-sm">gear@summitlab.com</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                Newsletter Técnico
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-glacier-500 transition-colors"
                />
                <button className="bg-glacier-500 hover:bg-glacier-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-sm transition-colors">
                  Unirme
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; 2026 SummitLab. Todos los derechos reservados. Tested at
            altitude.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
