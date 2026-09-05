import { MapPin, Mail, MountainSnow, Phone, ShieldCheck } from "lucide-react";

const socials = [
  { label: "X", href: "#" },
  { label: "YT", href: "#" },
  { label: "IG", href: "#" },
];

const categories = [
  "Hardshells",
  "Aislantes",
  "Softshells",
  "Capas Base",
  "Calzado Técnico",
  "Accesorios",
];

const support = [
  "Guía de Tallas",
  "Guía de Capas",
  "Cuidado del Equipamiento",
  "Garantía Vitalicia",
  "Reparaciones",
  "Envíos y Devoluciones",
];

export const FooterAlpine = () => {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <MountainSnow className="h-7 w-7 text-thermal-500" />
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SUMMIT<span className="text-thermal-500">LAB</span>
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Equipamiento técnico para los extremos. Cada producto supera
              10,000 horas de testing en campo antes de llegar a tus manos.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Categorías
            </h4>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition-all duration-200 hover:pl-1 hover:text-thermal-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Soporte
            </h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition-all duration-200 hover:pl-1 hover:text-thermal-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-glacier-400" />
                <span className="text-sm text-slate-400">
                  Calle Epstein 290, Población Miraluna
                  <br />
                  Alerce city, Chile
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-glacier-400" />
                <span className="text-sm text-slate-400">+56 9 - - - - -</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-glacier-400" />
                <span className="text-sm text-slate-400">
                  equipobomba@summitlab.com
                </span>
              </li>
            </ul>
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-xs leading-relaxed text-slate-400">
                Compras protegidas por autenticación corporativa y pedidos
                seguros hasta tu puerta.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/50 py-6 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; 2026 SummitLab. Todos los derechos reservados. Tested at
            altitude.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="transition-colors hover:text-slate-300">
              Privacidad
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              Términos
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};