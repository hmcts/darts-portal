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

  // const checkAuthenticated = disableAuthentication
  //   ? (_: Request, __: Response, next: NextFunction) => next()
  //   : isAuthenticated;

  // const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  //   if (disableAuthentication) {
  //     return next();
  //   }
  //   console.log('BEFORE isAuthenticated');
  //   await isAuthenticated(req, res);
  //   console.log('AFTER isAuthenticated');
  //   next();
  // };

  const debug = (route: string) => (_: Request, __: Response, next: NextFunction) => {
    console.log('DEBUG MIDDLEWARE', route);
    next();
  };

  // authenticated routes
  // temporary API stubbing in place, should be removed onces all API endpoints are available
  router.use(
    '/api',
    debug('/api BEFORE'),
    isAuthenticated,
    debug('/api AFTER'),
    stubDataController.init(),
    apiController.init()
  );
  router.use('/user', debug('/user BEFORE'), isAuthenticated, debug('/user AFTER'), userController.init());
  router.use('/download', isAuthenticated, downloadController.init());

  // unauthenticated routes
  router.use('/auth', authenticationController.init(disableAuthentication));

  return router;
};
