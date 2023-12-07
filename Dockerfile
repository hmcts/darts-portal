FROM hmctspublic.azurecr.io/base/node:20-alpine AS base

COPY --chown=hmcts:hmcts . .

ENV YARN_ENABLE_GLOBAL_CACHE=true
ENV YARN_GLOBAL_FOLDER=/opt/.yarn

RUN yarn install
RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000
