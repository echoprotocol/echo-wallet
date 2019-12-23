FROM node:10.16.1-alpine as builder

RUN apk add --update-cache git python make g++ gcc libpng-dev automake libtool

WORKDIR /app/

COPY package.json ./

RUN npm i

COPY config ./config
COPY resources ./resources
COPY src ./src
COPY scripts ./scripts
COPY main ./main
COPY babel.config.js ./
COPY webpack-configs/webpack.config.web.babel.js ./webpack-configs/webpack.config.web.babel.js

RUN npm run build-web

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html
