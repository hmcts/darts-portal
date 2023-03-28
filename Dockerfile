FROM node:19 as base
COPY package.json yarn.lock /app/

FROM base as build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime
COPY --from=build . ./
WORKDIR /app
EXPOSE 3000
CMD [ "yarn", "start" ]