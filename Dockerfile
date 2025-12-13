FROM node:22
# Työhakemisto kontissa
WORKDIR /app
COPY backend/package*.json ./
RUN npm install -g npm@latest
COPY backend .
ENV PORT=$PORT
EXPOSE $PORT

CMD ["npm", "start"]

