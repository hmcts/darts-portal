import config from 'config';
import * as express from 'express';
import { Request, Router } from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';

function proxyMiddleware() {
  return createProxyMiddleware({
    target: config.get('darts-api.url'),
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    logger: console,
    on: {
      proxyReq: (proxyReq, req: Request) => {
        if (req.session.securityToken) {
          if (req.session.securityToken.accessToken) {
            proxyReq.setHeader('Authorization', `Bearer ${req.session.securityToken.accessToken}`);
          }
          if (req.session.securityToken.userState?.userId) {
            proxyReq.setHeader('user_id', req.session.securityToken.userState.userId);
          }
        }
      },
    },
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
