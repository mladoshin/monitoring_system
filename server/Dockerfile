# Данный dockerfile рассчитан на то, что build context будет drum-school
FROM node:18.7.0-alpine as builder

WORKDIR /usr/src/ms-backend

COPY ./server/package*.json ./server/

WORKDIR /usr/src/ms-backend/server
RUN npm install --legacy-peer-deps
# If you are building your code for production
# RUN npm ci --only=production

WORKDIR /usr/src/ms-backend
# Bundle app source
COPY ./server ./server
COPY ./common ./common

EXPOSE 7070 3000
WORKDIR /usr/src/ms-backend/server

CMD [ "node", "index.js" ]
