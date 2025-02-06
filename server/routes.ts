import type { Router } from 'express';
import express, { NextFunction, Request, Response } from 'express';
import {
  apiController,
  authenticationController,
  downloadController,
  userController,
  stubDataController,
} from './controllers';
import { isAuthenticated } from './middleware';

export default (disableAuthentication = false): Router => {
  const router = express.Router();

  const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (disableAuthentication) {
      return next();
    }
    await isAuthenticated(req);
    next();
  };

  // authenticated routes
  // temporary API stubbing in place, should be removed onces all API endpoints are available
  router.use('/api', checkAuthenticated, stubDataController.init(), apiController.init());
  router.use('/user', checkAuthenticated, userController.init());
  router.use('/download', checkAuthenticated, downloadController.init());

  // unauthenticated routes
  router.use('/auth', authenticationController.init(disableAuthentication));

  return router;
};
