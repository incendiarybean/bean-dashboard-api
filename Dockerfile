#BUILD
FROM node:current-slim as build
ENV NODE_ENV=production

WORKDIR /intranet-api
ENV PATH /intranet-api/node_modules/.bin:$PATH

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./run.sh ./

COPY . .

#PROD
FROM node:current-slim
WORKDIR /intranet-api

COPY --from=build intranet-api/run.sh /intranet-api/run.sh
COPY --from=build intranet-api/package.json /intranet-api/package.json
COPY --from=build intranet-api/api /intranet-api/api
COPY --from=build intranet-api/config /intranet-api/config
COPY --from=build intranet-api/server /intranet-api/server

COPY . ./

CMD [ "./run.sh" ]
