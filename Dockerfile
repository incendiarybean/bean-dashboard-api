FROM node:current-slim
ENV NODE_ENV=production

WORKDIR /intranet-api

COPY . .

RUN yarn --production

COPY . ./

CMD [ "yarn", "start" ]
