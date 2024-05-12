FROM node:alpine AS build
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm install
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
COPY . .
RUN npm run build
FROM nginx:stable
COPY --from=build /usr/local/app/dist/analytics-challenge/browser/ /usr/share/nginx/html
EXPOSE 80