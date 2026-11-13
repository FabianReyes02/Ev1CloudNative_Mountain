FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_API_BASE_URL
ARG VITE_USE_MOCK=false
ARG VITE_AZURE_CLIENT_ID
ARG VITE_AZURE_TENANT_ID
ARG VITE_AZURE_API_SCOPE
ARG VITE_JWT_ISSUERS=pedidos360-usuarios
ARG VITE_JWT_AUDIENCES=pedidos360-api
ARG VITE_JWT_REQUIRED_SCOPES=orders.write
ARG VITE_JWT_REQUIRED_ROLES=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK
ENV VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID
ENV VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID
ENV VITE_AZURE_API_SCOPE=$VITE_AZURE_API_SCOPE
ENV VITE_JWT_ISSUERS=$VITE_JWT_ISSUERS
ENV VITE_JWT_AUDIENCES=$VITE_JWT_AUDIENCES
ENV VITE_JWT_REQUIRED_SCOPES=$VITE_JWT_REQUIRED_SCOPES
ENV VITE_JWT_REQUIRED_ROLES=$VITE_JWT_REQUIRED_ROLES

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

# nginx.conf es una configuración COMPLETA (bloques events/http):
# debe reemplazar el nginx.conf principal, NO un archivo de conf.d
# (conf.d se incluye dentro del bloque http y ahí no pueden existir
# events/http: el contenedor moriría al arrancar).
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
