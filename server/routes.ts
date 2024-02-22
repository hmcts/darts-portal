import type { Router } from 'express';
import express, { NextFunction, Request, Response } from 'express';
import {
  apiController,
  appController,
  authController,
  authenticationController,
  downloadController,
  userController,
} from './controllers';
import { isAuthenticated } from './middleware';

export default (disableAuthentication = false): Router => {
  const router = express.Router();

  const checkAuthenticated = disableAuthentication
    ? (req: Request, res: Response, next: NextFunction) => next()
    : isAuthenticated;

  // authenticated routes
  router.use('/api', checkAuthenticated, apiController.init());
  router.use('/user', checkAuthenticated, userController.init());
  router.use('/download', checkAuthenticated, downloadController.init());

  // unauthenticated routes
  router.use('/auth', authenticationController.init(disableAuthentication));
  router.use('/app', appController.init());
  // TODO: rename this, or move into authentication controller
  router.use(authController.init());

  return router;
};
