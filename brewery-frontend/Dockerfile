
FROM node:alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build --prod

FROM nginx:latest

COPY --from=build /app/dist/brewery /usr/share/nginx/html/

COPY docker/etc/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
