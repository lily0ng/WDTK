FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 3001

CMD ["node", "apps/service/src/index.js"]
