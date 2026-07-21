# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY Backend/package*.json ./
RUN npm install --production

COPY Backend/ ./

EXPOSE 5000

CMD ["node", "index.js"]
