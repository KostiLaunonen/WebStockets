# --- Frontend build stage ---
FROM node:22 AS build-frontend
WORKDIR /app/frontend

# Kopioidaan frontendin package.json ja lock
COPY frontend/package*.json ./
RUN npm install

# Kopioidaan loput frontendin lähdekoodit
COPY frontend .

# Rakennetaan frontend (React/Vite/Next tms.)
RUN npm run build

# --- Backend stage ---
FROM node:22 AS backend
WORKDIR /app/backend

# Kopioidaan backendin package.json ja lock
COPY backend/package*.json ./
RUN npm install

# Kopioidaan loput backendin lähdekoodit
COPY backend .

# Kopioidaan frontendin build backendin public-kansioon
COPY --from=build-frontend /app/frontend/build ./public

# Render asettaa PORT automaattisesti
ENV PORT=$PORT
EXPOSE $PORT

# Käynnistetään backend
CMD ["npm", "start"]
