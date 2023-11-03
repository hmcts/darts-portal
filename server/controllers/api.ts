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
      if (req.path.startsWith('/audio/preview')) {
        console.log('onProxyReq::proxyReq', req.path, proxyReq.getHeaders());
        console.log('onProxyReq::req', req.path, req.headers);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      if (req.path.startsWith('/audio/preview')) {
        console.log('onProxyRes::proxyRes', req.path, proxyRes.headers);
        console.log('onProxyRes::res', req.path, res);
      }
    },
    onError: (err, req) => {
      if (req.path.startsWith('/audio/preview')) {
        console.error('onError::err', req.path, err);
      }
    },
  });
}

export function init(): Router {
  const router = express.Router();
  router.use(proxyMiddleware());
  return router;
}
