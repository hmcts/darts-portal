FROM node:16-alpine as base
COPY package.json yarn.lock .yarn/ /app/

FROM base as build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime
RUN apk update && apk add lame
COPY --from=build . ./
WORKDIR /app
EXPOSE 3000
CMD [ "yarn", "start" ]