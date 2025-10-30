FROM node:18-alpine as frontend-build
WORKDIR /workspace/frontend
# Copy frontend from the build context root (render.yaml rootDir is project root)
COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
# Vite reads these at build if provided, but app now defaults to relative URLs
ARG VITE_API_BASE
ARG VITE_WS_URL
ENV VITE_API_BASE=${VITE_API_BASE} VITE_WS_URL=${VITE_WS_URL}
RUN npm run build

FROM node:18-alpine as server
WORKDIR /app/server
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY . .
# Place built frontend where server expects: /app/frontend/dist
RUN mkdir -p /app/frontend
COPY --from=frontend-build /workspace/frontend/dist /app/frontend/dist
EXPOSE 4000
CMD ["npm", "start"]


