FROM node:lts-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./

RUN npm install

COPY --chown=node:node ./src .
 
CMD ["node", "index.js"]