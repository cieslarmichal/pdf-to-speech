FROM node:20.11.1-alpine

RUN apk update
RUN apk add --no-cache libc6-compat bash

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

USER node

CMD node src/index.js
