FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "start:dev", "wallet-service"]

FROM node:alpine as production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN yarn install --frozen-lockfile

COPY . .

# Build the app
RUN yarn run build

CMD [ "node", "dist/apps/wallet-service/main.js" ]








