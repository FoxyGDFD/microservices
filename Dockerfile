FROM node:latest AS nest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM nest AS api-gateway

WORKDIR /app

CMD [ "npm", "run", "start:dev" ]



FROM nest AS auth

WORKDIR /app

RUN npm run db-client:auth
CMD [ "npm", "run", "start:dev", "auth" ]