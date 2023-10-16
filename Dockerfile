FROM hmctspublic.azurecr.io/base/node:18-alpine AS base

COPY --chown=hmcts:hmcts . .
RUN yarn install
RUN yarn build

ENV NODE_ENV=production


EXPOSE 3000
