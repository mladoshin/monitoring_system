# Данный dockerfile рассчитан на то, что build context будет drum-school
FROM node:18.7.0-alpine as builder

WORKDIR /usr/src/ms-webapp

COPY webapp/package*.json ./

RUN npm ci --legacy-peer-deps

COPY webapp/ .

RUN npm run build

FROM node:18.7.0-alpine as runner

WORKDIR /usr/src/ms-webapp

RUN npm install --global http-server

COPY --from=builder /usr/src/ms-webapp/dist ./public
