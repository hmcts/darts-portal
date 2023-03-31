FROM hmctspublic.azurecr.io/base/node:18-alpine as base

COPY --chown=hmcts:hmcts . .
RUN yarn install
RUN yarn build

EXPOSE 3000
