# Build stage
FROM node:22 AS build
WORKDIR /app

COPY Frontend_IMS/package*.json ./
RUN npm ci

COPY Frontend_IMS/ ./
RUN npm run build -- --configuration=production

# Serve stage
FROM nginx:stable
COPY --from=build /app/dist/ims-frontend/browser /browser/usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
