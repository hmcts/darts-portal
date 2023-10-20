import express, { NextFunction, Request, Response } from 'express';
import type { Router } from 'express';
import { apiController, appController, authController, authenticationController, userController } from './controllers';
import { isAuthenticated } from './middleware';
import axios from 'axios';
import config from 'config';

export default (disableAuthentication = false): Router => {
  const router = express.Router();

  const checkAuthenticated = disableAuthentication
    ? (req: Request, res: Response, next: NextFunction) => next()
    : isAuthenticated;

  // START:
  // This is for testing audio preview without http-middleware-proxy
  // To be removed afterwards.
  router.use('/api-test', checkAuthenticated, async (req, res) => {
    try {
      console.log('API-TEST::before HTTP request', new Date());
      const response = await axios.get(`${config.get('darts-api.url')}${req.path.replace('api-test', '')}`, {
        headers: {
          Authorization: `Bearer ${req.session?.securityToken?.accessToken}`,
        },
      });
      console.log('API-TEST::after HTTP request', new Date());
      res.set(response.headers);
      res.status(response.status);
      res.send(response.data);
    } catch (err) {
      console.error('API-TEST::error', new Date());
      res.status(500).send(err);
    }
  });
  // END

  // authenticated routes
  router.use('/api', checkAuthenticated, apiController.init());
  router.use('/user', checkAuthenticated, userController.init());

  // unauthenticated routes
  router.use('/auth', authenticationController.init(disableAuthentication));
  router.use('/app', appController.init());
  // TODO: rename this, or move into authentication controller
  router.use(authController.init());

  return router;
};
