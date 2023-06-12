import * as express from 'express';
import config from 'config';
import { Router } from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';

function proxyMiddleware() {
  // TODO: add Authorization header using req.session.accessToken as value
  return createProxyMiddleware({
    target: config.get('darts-api.url'),
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    logLevel: 'debug',
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
