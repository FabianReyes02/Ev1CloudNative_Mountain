# Pedidos360 â€” Notas de ContinuaciÃ³n

> Frontend de la tienda "SummitLab" (equipamiento de montaÃ±a) dentro del proyecto
> **Pedidos360: Arquitectura Cloud-Native Multi-Nube**.
> Este archivo resume el estado actual, cÃ³mo correr el proyecto, y quÃ© falta para
> seguir otro dÃ­a.

---

## 1. CÃ³mo levantar el proyecto (en una sesiÃ³n futura)

```bash
npm install        # solo la primera vez
npm run dev        # desarrollo en http://localhost:5173
npm run build      # build de producciÃ³n (dist/)
npm run preview    # sirve el build
npm run lint       # ESLint
```

- Stack: **React 19 + Vite 8 + Tailwind CSS v4** (sin router todavÃ­a, pÃ¡gina Ãºnica con anclas `#catalog`, `#tech`, `#activities`).
- Todo el estado de carrito se persiste en `localStorage` (clave `summitlab.cart.v1`).

---

## 2. Estructura del cÃ³digo

```
src/
â”œâ”€â”€ main.jsx                          # Providers: ToastProvider + CartProvider
â”œâ”€â”€ App.jsx                           # PÃ¡gina principal (catÃ¡logo, filtros, tech, banner)
â”œâ”€â”€ index.css                         # Tema, colores, tipografÃ­as y TODAS las animaciones
â”œâ”€â”€ context/
â”‚   â””â”€â”€ CartContext.jsx               # Estado del carrito + persistencia
â”œâ”€â”€ services/
â”‚   â””â”€â”€ api.js                        # Capa de API lista para el backend (mocks hoy)
â”œâ”€â”€ lib/
â”‚   â””â”€â”€ placeholderImage.js           # Imagen de respaldo SVG + manejo de error
â”œâ”€â”€ data/
â”‚   â””â”€â”€ mockProducts.js               # Productos de prueba, actividades, filtros
â””â”€â”€ components/
    â”œâ”€â”€ layout/   (NavbarTech, FooterAlpine)
    â”œâ”€â”€ home/     (HeroMountain, ActivityFilter)
    â”œâ”€â”€ catalog/  (ProductCard, TechFilterDrawer)
    â”œâ”€â”€ cart/     (CartDrawer)
    â””â”€â”€ ui/       (Toast, Reveal)
```

### Animaciones (todo en `src/index.css`)
- `animate-fade-up`, `animate-fade-in`, `animate-scale-in`, `animate-pop`
- `animate-aurora`, `animate-kenburns`, `animate-drift` (partÃ­culas de nieve)
- `animate-marquee`, `animate-spin-slow`, `animate-gradient-x`
- `animate-slide-down`, `animate-toast-in`, `animate-cart-pop`
- Scroll-reveal: componente `<Reveal>` (`src/components/ui/Reveal.jsx`) con
  IntersectionObserver + delays escalonados.
- Todas respetan `prefers-reduced-motion`.

---

## 3. Conectar el backend (lo que hay que hacer despuÃ©s)

Hoy todo funciona con datos simulados. La integraciÃ³n real estÃ¡ preparada en
`src/services/api.js`:

1. Crear `.env` copiando `.env.example`:
   ```
   VITE_API_BASE_URL=https://TU-APIGATEWAY.execute-api.REGION.amazonaws.com/prod
   VITE_USE_MOCK=false
   ```
2. Al poner `VITE_USE_MOCK=false`:
   - `productService.list()` harÃ¡ GET a `${API_BASE_URL}/products`
   - `cartService.create(payload)` harÃ¡ POST a `${API_BASE_URL}/orders`
3. Los 401/403 del API Gateway ya se manejan: el checkout muestra el toast de
   "Necesitas iniciar sesiÃ³n".

### Pendiente por componente
| Componente | Proveedor | Ruta esperada | Estado |
|---|---|---|---|
| CatÃ¡logo de productos | Microservicio Productos (AWS) | `/products` | Conectar |
| Pedidos / carrito | Microservicio Carrito (AWS) | `/orders` (POST) | Conectar |
| Login/Logout | Azure AD (MSAL) | OAuth 2.0 / OIDC + PKCE | Pendiente |

---

## 4. Siguiente etapa: Azure AD + MSAL (aÃºn NO implementado)

- Instalar `@azure/msal-browser` y `@azure/msal-react`.
- Configurar `PublicClientApplication` con `auth.flowRedirectStartInBackground` etc.
- App Registration: URIs de redirecciÃ³n, scopes y roles requeridos.
- Adjuntar el token JWT en cada peticiÃ³n hacia la API (interceptor / wrapper de `fetch`
  en `src/services/api.js`).
- Los botones de la UI ya tienen el placeholder:
  - Navbar: botÃ³n **"Ingresar"** (`handleAuth`).
  - Banner: botÃ³n **"Crear cuenta"**.

## 5. Siguiente etapa: AWS API Gateway + microservicios (aÃºn NO implementado)

- **Productos**: microservicio que expone `/products` (listado + detalle).
- **Carrito/Ã“rdenes**: ruta protegida `/orders` que exige token JWT + scopes/roles.
- **JWT Authorizer** en el API Gateway validando firma/vigencia/issuer/audience
  contra los JWKS de Azure (rechazar sin token con 401/403).
- CORS restringido al dominio del frontend.

---

## 6. ImÃ¡genes y precios (Ãºltimo cambio)

- Verificadas todas las URLs con HEAD (200 OK). Se reemplazaron dos que devolvÃ­an
  404 en `src/data/mockProducts.js`:
  - `Ridge Thermal Down` â†’ `photo-1544022613-e87ca75a784a`
  - `StormBreaker GTX` â†’ `photo-1594633312681-425c7b97ccd1`
- Hero y banner de montaÃ±a verificados (200 OK).
- Respaldo automÃ¡tico: si una imagen (incluidas las del backend futuro) no carga,
  `onError` la cambia por un placeholder SVG (`src/lib/placeholderImage.js`).
- **Precios en pesos chilenos (CLP)**: `Intl.NumberFormat('es-CL', { style: 'currency',
  currency: 'CLP' })` en `ProductCard.jsx` y `CartDrawer.jsx`.
  - Nota: hoy el nÃºmero del precio se muestra tal cual (ej. 899 â†’ `$899`).
    Si se quiere el valor real en CLP hay que multiplicar por el tipo de cambio al
    cargar el catÃ¡logo.

---

## 7. Errores conocidos / mejoras pendientes

- El botÃ³n de **buscar** del navbar es placeholder (muestra un toast).
- El **login** es placeholder hasta integrar MSAL.
- No hay pÃ¡gina de detalle de producto ni vista 404 (rutas con anclas Ãºnicamente).
- No hay test runners configurados (solo lint + build).
- Si se agrega React Router, migrar las anclas `#catalog/#tech/#activities` a rutas.

---

## 8. Despliegue AWS: API Gateway + nginx + Kafka (nov 2026)

Estado del flujo completo en AWS (VPC 10.0.0.0/16, IPs segÃºn
`Ev1CloudNative_Mountain_backend_parte3/docs/DESPLIEGUE_AWS.md`):

```
Browser
  â””â”€ API Gateway HTTP (frontend-mountain, id 40k6dgt9t8, stage $default)
       ruta $default          â†’ integraciÃ³n http://34.233.99.190 (root /)
       ruta ANY /{proxy+}     â†’ integraciÃ³n http://34.233.99.190/{proxy}
            â””â”€ nginx (este repo, EC2 10.0.1.239)
                 â”œâ”€ /            â†’ index.html + /assets (cache inmutable)
                 â”œâ”€ /api/products|orders|auth|users...  â†’ EC2 10.0.3.128 (8081-8083)
                 â”œâ”€ /api/notifications|cart|shipments   â†’ EC2 10.0.3.122 (8084-8086)
                 â””â”€ /api/payments|recommendations       â†’ EC2 10.0.14.31 (8087-8088)
```

### Puntos clave aprendidos (no romper)

- **IntegrationUri sin `{proxy}`** hace que el API Gateway no reenvÃ­e el path:
  todo llegaba a nginx como `/` y los `.js` volvÃ­an como `text/html`
  â†’ **pÃ¡gina en blanco**. La ruta `/{proxy+}` debe usar `http://IP/{proxy}`
  y la raÃ­z una integraciÃ³n aparte (o `$default`).
- El esquema de la integraciÃ³n es **`http://` (puerto 80)**: la EC2 no tiene TLS.
- `nginx.conf` es una config COMPLETA (bloques `events{}/http{}`): en el
  Dockerfile va a `/etc/nginx/nginx.conf`, **no** a `conf.d/default.conf`
  (ahÃ­ el contenedor muere al arrancar).
- IPs upstream reales (sesiÃ³n nov 2026): backend-1 `10.0.3.128`, backend-2
  `10.0.3.122`, backend-3 `10.0.14.31`. **Las IPs privadas rotan en cada
  sesiÃ³n del lab de AWS Academy**: volver a obtenerlas con
  `aws ec2 describe-instances` y actualizar `nginx.conf` en cada despliegue.

### MensajerÃ­a: Kafka (backend-3) reemplaza RabbitMQ (backend-1)

RabbitMQ fue eliminado por completo. El broker es **Kafka (KRaft)** en
backend-3 (`pedidos360-kafka`, listener EXTERNAL `29092`, UI en `8090` solo
por tÃºnel SSH):

- `servicio-pedidos` (B1) publica `pedido.creado` en el tÃ³pico **`pedidos.creados`**
  (JSON plano, clave = `orderId`).
- Consumen el mismo tÃ³pico con groupId propio: `productos-stock` (B1),
  `notificaciones-pedidos` / `envios-pedidos` (B2), `pagos-pedidos` (B3).
- B1 y B2 configuran `KAFKA_BOOTSTRAP_SERVERS=10.0.14.31:29092`
  (SG de backend-3 debe permitir 29092 desde los SG de B1 y B2).
- Local: `docker compose up` en backend-3 y no setear la variable
  (default `localhost:29092`).