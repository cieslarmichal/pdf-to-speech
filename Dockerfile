FROM node:20.12.2-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

USER node

CMD node dist/src/index.js
