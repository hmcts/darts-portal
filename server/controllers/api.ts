import * as express from 'express';
import config from 'config';
import { Router } from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';

function proxyMiddleware() {
  return createProxyMiddleware({
    target: config.get('darts-api.url'),
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    logLevel: 'debug',
    onProxyRes: (proxyRes, req) => {
      if (req.session.accessToken) {
        proxyRes.headers['Authorization'] = `Bearer: ${req.session.accessToken}`;
      }
    },
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
