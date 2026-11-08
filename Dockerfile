# ---- Stage 1: build the React app ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: serve the static files with nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
# Cloud Run and Render pass the port in $PORT; default 8080
ENV PORT=8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
