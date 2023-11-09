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
    onProxyReq: (proxyReq, req) => {
      if (req.session.securityToken) {
        if (req.session.securityToken.accessToken) {
          proxyReq.setHeader('Authorization', `Bearer ${req.session.securityToken.accessToken}`);
        }
        if (req.session.securityToken.userState?.userId) {
          proxyReq.setHeader('user_id', req.session.securityToken.userState.userId);
        }
      }
    },
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
