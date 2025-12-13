FROM node:22
# Työhakemisto kontissa
WORKDIR /app
COPY backend/package*.json ./
RUN npm install -g npm@latest
RUN rm -f package-lock.json
RUN npm install
COPY backend .
ENV PORT=$PORT
EXPOSE $PORT

CMD ["npm", "start"]