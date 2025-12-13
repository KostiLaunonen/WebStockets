FROM node:22
# Työhakemisto kontissa
WORKDIR /app
COPY backend/package*.json ./
RUN npm install@latest
COPY backend .
ENV PORT=$PORT
EXPOSE $PORT

CMD ["npm", "start"]

