FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["echo", "Container pronto. Aguardando comando do Cron Job."]