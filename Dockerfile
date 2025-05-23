FROM hmctspublic.azurecr.io/base/node:22-alpine AS base

COPY --chown=hmcts:hmcts . .
RUN yarn install
RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server/server"]