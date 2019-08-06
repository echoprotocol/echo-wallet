FROM node:10.16.1-alpine as builder

RUN apk add --update-cache git python

WORKDIR /app/

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build
