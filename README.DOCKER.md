# Frontend con Docker

Construir la imagen pasando la configuracion de Vite como argumentos:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://TU_API_ID.execute-api.TU_REGION.amazonaws.com \
  --build-arg VITE_USE_MOCK=false \
  --build-arg VITE_AZURE_CLIENT_ID=TU_CLIENT_ID_FRONTEND \
  --build-arg VITE_AZURE_TENANT_ID=TU_TENANT_ID \
  --build-arg VITE_AZURE_API_SCOPE=api://TU_CLIENT_ID_API/orders.write \
  -t mountain-front .
```

Ejecutar:

```bash
docker run -d --name mountain-front --restart unless-stopped -p 80:80 mountain-front
```

Comprobar:

```bash
curl http://localhost/health
```
