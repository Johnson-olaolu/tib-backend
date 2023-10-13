FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "start:dev", "user-service"]

FROM node:alpine as production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=development . .

# Build the app
RUN yarn run build

CMD [ "node", "dist/apps/user-service/main.js" ]








