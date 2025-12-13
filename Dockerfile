FROM node:22 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN rm -f package-lock-json
RUN npm install --no-optional
COPY frontend .
RUN npm run build

FROM node:18
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend .

COPY --from=build-frontend /app/frontend/build ./public

ENV PORT=$PORT
EXPOSE $PORT

CMD ["npm", "start"]