FROM hmctspublic.azurecr.io/base/node:16-alpine as base
ENV WORKDIR /opt/app
WORKDIR /opt/app

COPY --chown=hmcts:hmcts . .
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]