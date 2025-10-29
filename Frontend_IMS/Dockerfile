# Build stage
FROM node:22 AS build
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .
RUN npm run build -- --configuration=production

# Serve stage
FROM nginx:stable
COPY --from=build /app/dist/ims-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
