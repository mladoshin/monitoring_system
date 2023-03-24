# Данный dockerfile рассчитан на то, что build context будет drum-school
FROM node:18.7.0-alpine as builder

WORKDIR /usr/src/ms-webapp

COPY ./webapp/package*.json ./webapp/
# COPY webapp/package*.json ./

WORKDIR /usr/src/ms-webapp/webapp
RUN npm ci --legacy-peer-deps

WORKDIR /usr/src/ms-webapp
COPY ./webapp ./webapp
COPY ./common ./common

WORKDIR /usr/src/ms-webapp/webapp
RUN npm run build

FROM node:18.7.0-alpine as runner

WORKDIR /usr/src/ms-webapp/webapp

RUN npm install --global http-server

COPY --from=builder /usr/src/ms-webapp/webapp/dist ./public
