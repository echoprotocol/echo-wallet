FROM node:10.16.1-alpine as builder

RUN apk add --update-cache git python make g++ gcc libpng-dev automake libtool

WORKDIR /app/

COPY package.json ./

RUN npm i

COPY config ./config
COPY resources ./resources
COPY src ./src
COPY .babelrc ./
COPY webpack.config.js ./

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html
