import * as express from 'express';
import config from 'config';
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
      proxyRes: (proxyRes, req, res) => {
        if (![200, 201].includes(proxyRes.statusCode as number)) {
          console.log(
            `[RESPONSE] HTTP proxy middleware: method=${req.method}, url=${req.url}, code=${proxyRes.statusCode}, msg=${proxyRes.statusMessage}`
          );
        }
      },
      error: (err, req) => {
        console.error(`[ERROR] HTTP proxy middleware: method=${req.method}, url=${req.url}`, err);
      },
    },
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
