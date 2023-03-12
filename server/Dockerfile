# Данный dockerfile рассчитан на то, что build context будет drum-school
FROM node:18.7.0-alpine as builder

WORKDIR /usr/src/ms-backend

COPY server/package*.json ./

RUN npm install --legacy-peer-deps
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY server/ .

EXPOSE 7070 3000
WORKDIR /usr/src/ms-backend

CMD [ "node", "index.js" ]
