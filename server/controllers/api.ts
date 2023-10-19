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
      console.log('onProxyReq::proxyReq', req.path, proxyReq);
      console.log('onProxyReq::req', req.path, req);
      if (req.session.securityToken) {
        if (req.session.securityToken.accessToken) {
          proxyReq.setHeader('Authorization', `Bearer ${req.session.securityToken.accessToken}`);
        }
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('onProxyRes::proxyRes', req.path, proxyRes);
      console.log('onProxyRes::res', req.path, res);
    },
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
