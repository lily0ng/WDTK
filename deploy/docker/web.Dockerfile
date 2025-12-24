FROM node:20-alpine

WORKDIR /app

ARG VITE_WEBDEVKIT_SERVICE_URL
ENV VITE_WEBDEVKIT_SERVICE_URL=$VITE_WEBDEVKIT_SERVICE_URL

COPY . .

RUN npm ci
RUN npm run build -w webdevkit-web

EXPOSE 3000

CMD ["npm", "run", "preview", "-w", "webdevkit-web", "--", "--host", "0.0.0.0", "--port", "3000", "--strictPort"]
