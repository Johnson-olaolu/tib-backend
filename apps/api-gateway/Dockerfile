FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "start:dev", "api-gateway"]

FROM node:alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build api-gateway


FROM node:alpine as production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

CMD [ "node", "dist/apps/api-gateway/main.js" ]



