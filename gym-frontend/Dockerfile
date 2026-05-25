# Etapa 1: Construir la aplicación React (Vite)
FROM node:20-alpine AS build   

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la app para producción (genera carpeta /app/dist)
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración para SPA (React Router): redirigir todas las rutas a index.html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]