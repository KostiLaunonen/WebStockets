FROM node:22 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install -g npm@latest
COPY frontend .

FROM node:18
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend .

ENV PORT=$PORT
EXPOSE $PORT

CMD ["npm", "start"]