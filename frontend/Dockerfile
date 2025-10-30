FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_API_BASE=${VITE_API_BASE} VITE_WS_URL=${VITE_WS_URL}
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server{listen 80;root /usr/share/nginx/html;gzip on;location ~* \.(js|css|svg|png|jpg|jpeg|gif|ico)$ {add_header Cache-Control "public, max-age=31536000";try_files $uri =404;}location / {try_files $uri /index.html;}}' > /etc/nginx/conf.d/default.conf
EXPOSE 80


