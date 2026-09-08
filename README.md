# SummitLab - Frontend

Frontend de la tienda de equipamiento de montaña SummitLab. Está construido con React 19, Vite 8 y Tailwind CSS 4.

## Propósito

La aplicación consume un único punto de entrada HTTP: el gateway del backend o AWS API Gateway. El navegador no debe conocer las direcciones internas de `servicio-productos`, `servicio-pedidos` ni `servicio-usuarios`.

Incluye catálogo, filtros técnicos, carrito, registro, ingreso, persistencia local del usuario y envío automático del JWT como `Authorization: Bearer <token>`.

## Arquitectura de autenticación

El flujo actual es:

```text
Frontend -> API Gateway/gateway local -> servicio-usuarios
```

El backend responde con un JWT HS256 propio. El frontend lo guarda en `localStorage` usando las claves `summitlab_token` y `summitlab_user`. Ese token permite acceder a `/orders` cuando el backend está configurado con validación JWT local.

### Azure Entra ID

Azure Entra ID es la opción recomendada para identidad en producción. Su token JWT demuestra que el usuario fue autenticado por Microsoft y permite que API Gateway y/o `servicio-pedidos` validen la firma mediante JWKS, el emisor, la audiencia y permisos como `orders.write`.

El frontend actual funciona con el JWT local de `servicio-usuarios`; todavía no usa MSAL para obtener tokens de Entra ID. Para cambiar a Entra ID se debe registrar la SPA en Azure, configurar MSAL y reemplazar el flujo local de `src/components/auth/AuthDrawer.jsx` por OAuth 2.0 / OIDC con PKCE. El backend ya contiene la validación JWKS opcional para pedidos.

## Variables de entorno

Crear `.env` en la raíz del frontend. No publicar secretos en este archivo.

### Gateway local o publicado directamente en EC2

```env
VITE_API_BASE_URL=http://localhost:9000
VITE_USE_MOCK=false
```

En EC2, reemplaza `localhost` por el DNS público o dominio:

```env
VITE_API_BASE_URL=http://ec2-XX-XX-XX-XX.REGION.compute.amazonaws.com:9000
VITE_USE_MOCK=false
```

### AWS API Gateway

```env
VITE_API_BASE_URL=https://TU_ID.execute-api.REGION.amazonaws.com/prod
VITE_USE_MOCK=false
```

`VITE_API_BASE_URL` debe ser la URL pública base, sin agregar `/products`, `/orders` ni `/auth`. Vite reemplaza esta variable durante el build, por lo que debe definirse antes de `npm run build`.

## Ejecución local

Requisitos: Node.js 20 o superior.

```bash
npm install
copy .env.example .env   # Windows
npm run dev
```

Frontend: `http://localhost:5173`.

Para usar el backend local, inicia los servicios y define `VITE_API_BASE_URL=http://localhost:9000` y `VITE_USE_MOCK=false`.

```bash
npm run lint
npm run build
npm run preview
```

## Despliegue del frontend en EC2

El frontend compilado queda en `dist/` y puede servirse con Nginx:

```bash
npm ci
npm run build
sudo cp -r dist/* /var/www/summitlab/
```

El Security Group debe permitir HTTP/HTTPS. Si el gateway está en la misma EC2, no es necesario exponer los puertos internos de los microservicios: solo debe ser público el puerto del gateway o el reverse proxy.

## Rutas consumidas

Todas se construyen como `${VITE_API_BASE_URL}${ruta}`:

| Funcionalidad | Método | Ruta             |
| ------------- | -----: | ---------------- |
| Catálogo      |    GET | `/products`      |
| Producto      |    GET | `/products/{id}` |
| Registro      |   POST | `/auth/registro` |
| Ingreso       |   POST | `/auth/ingreso`  |
| Crear pedido  |   POST | `/orders`        |

## Estructura relevante

```text
src/
  components/auth/AuthDrawer.jsx  # login y registro
  components/layout/NavbarTech.jsx
  context/CartContext.jsx
  services/api.js                 # URL base, Bearer token y servicios HTTP
  App.jsx
```
