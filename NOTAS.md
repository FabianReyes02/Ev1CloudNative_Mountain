# Pedidos360 — Notas de Continuación

> Frontend de la tienda "SummitLab" (equipamiento de montaña) dentro del proyecto
> **Pedidos360: Arquitectura Cloud-Native Multi-Nube**.
> Este archivo resume el estado actual, cómo correr el proyecto, y qué falta para
> seguir otro día.

---

## 1. Cómo levantar el proyecto (en una sesión futura)

```bash
npm install        # solo la primera vez
npm run dev        # desarrollo en http://localhost:5173
npm run build      # build de producción (dist/)
npm run preview    # sirve el build
npm run lint       # ESLint
```

- Stack: **React 19 + Vite 8 + Tailwind CSS v4** (sin router todavía, página única con anclas `#catalog`, `#tech`, `#activities`).
- Todo el estado de carrito se persiste en `localStorage` (clave `summitlab.cart.v1`).

---

## 2. Estructura del código

```
src/
├── main.jsx                          # Providers: ToastProvider + CartProvider
├── App.jsx                           # Página principal (catálogo, filtros, tech, banner)
├── index.css                         # Tema, colores, tipografías y TODAS las animaciones
├── context/
│   └── CartContext.jsx               # Estado del carrito + persistencia
├── services/
│   └── api.js                        # Capa de API lista para el backend (mocks hoy)
├── lib/
│   └── placeholderImage.js           # Imagen de respaldo SVG + manejo de error
├── data/
│   └── mockProducts.js               # Productos de prueba, actividades, filtros
└── components/
    ├── layout/   (NavbarTech, FooterAlpine)
    ├── home/     (HeroMountain, ActivityFilter)
    ├── catalog/  (ProductCard, TechFilterDrawer)
    ├── cart/     (CartDrawer)
    └── ui/       (Toast, Reveal)
```

### Animaciones (todo en `src/index.css`)
- `animate-fade-up`, `animate-fade-in`, `animate-scale-in`, `animate-pop`
- `animate-aurora`, `animate-kenburns`, `animate-drift` (partículas de nieve)
- `animate-marquee`, `animate-spin-slow`, `animate-gradient-x`
- `animate-slide-down`, `animate-toast-in`, `animate-cart-pop`
- Scroll-reveal: componente `<Reveal>` (`src/components/ui/Reveal.jsx`) con
  IntersectionObserver + delays escalonados.
- Todas respetan `prefers-reduced-motion`.

---

## 3. Conectar el backend (lo que hay que hacer después)

Hoy todo funciona con datos simulados. La integración real está preparada en
`src/services/api.js`:

1. Crear `.env` copiando `.env.example`:
   ```
   VITE_API_BASE_URL=https://TU-APIGATEWAY.execute-api.REGION.amazonaws.com/prod
   VITE_USE_MOCK=false
   ```
2. Al poner `VITE_USE_MOCK=false`:
   - `productService.list()` hará GET a `${API_BASE_URL}/products`
   - `cartService.create(payload)` hará POST a `${API_BASE_URL}/orders`
3. Los 401/403 del API Gateway ya se manejan: el checkout muestra el toast de
   "Necesitas iniciar sesión".

### Pendiente por componente
| Componente | Proveedor | Ruta esperada | Estado |
|---|---|---|---|
| Catálogo de productos | Microservicio Productos (AWS) | `/products` | Conectar |
| Pedidos / carrito | Microservicio Carrito (AWS) | `/orders` (POST) | Conectar |
| Login/Logout | Azure AD (MSAL) | OAuth 2.0 / OIDC + PKCE | Pendiente |

---

## 4. Siguiente etapa: Azure AD + MSAL (aún NO implementado)

- Instalar `@azure/msal-browser` y `@azure/msal-react`.
- Configurar `PublicClientApplication` con `auth.flowRedirectStartInBackground` etc.
- App Registration: URIs de redirección, scopes y roles requeridos.
- Adjuntar el token JWT en cada petición hacia la API (interceptor / wrapper de `fetch`
  en `src/services/api.js`).
- Los botones de la UI ya tienen el placeholder:
  - Navbar: botón **"Ingresar"** (`handleAuth`).
  - Banner: botón **"Crear cuenta"**.

## 5. Siguiente etapa: AWS API Gateway + microservicios (aún NO implementado)

- **Productos**: microservicio que expone `/products` (listado + detalle).
- **Carrito/Órdenes**: ruta protegida `/orders` que exige token JWT + scopes/roles.
- **JWT Authorizer** en el API Gateway validando firma/vigencia/issuer/audience
  contra los JWKS de Azure (rechazar sin token con 401/403).
- CORS restringido al dominio del frontend.

---

## 6. Imágenes y precios (último cambio)

- Verificadas todas las URLs con HEAD (200 OK). Se reemplazaron dos que devolvían
  404 en `src/data/mockProducts.js`:
  - `Ridge Thermal Down` → `photo-1544022613-e87ca75a784a`
  - `StormBreaker GTX` → `photo-1594633312681-425c7b97ccd1`
- Hero y banner de montaña verificados (200 OK).
- Respaldo automático: si una imagen (incluidas las del backend futuro) no carga,
  `onError` la cambia por un placeholder SVG (`src/lib/placeholderImage.js`).
- **Precios en pesos chilenos (CLP)**: `Intl.NumberFormat('es-CL', { style: 'currency',
  currency: 'CLP' })` en `ProductCard.jsx` y `CartDrawer.jsx`.
  - Nota: hoy el número del precio se muestra tal cual (ej. 899 → `$899`).
    Si se quiere el valor real en CLP hay que multiplicar por el tipo de cambio al
    cargar el catálogo.

---

## 7. Errores conocidos / mejoras pendientes

- El botón de **buscar** del navbar es placeholder (muestra un toast).
- El **login** es placeholder hasta integrar MSAL.
- No hay página de detalle de producto ni vista 404 (rutas con anclas únicamente).
- No hay test runners configurados (solo lint + build).
- Si se agrega React Router, migrar las anclas `#catalog/#tech/#activities` a rutas.