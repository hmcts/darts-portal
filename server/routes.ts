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
import bodyParser from 'body-parser';

export default (disableAuthentication = false): Router => {
  const router = express.Router();

  const checkAuthenticated = disableAuthentication
    ? (req: Request, res: Response, next: NextFunction) => next()
    : isAuthenticated;

  // authenticated routes
  // temporary API stubbing in place, should be removed onces all API endpoints are available
  router.use('/api', checkAuthenticated, stubDataController.init(), apiController.init());
  router.use('/user', checkAuthenticated, userController.init());
  router.use('/download', checkAuthenticated, downloadController.init());

  // unauthenticated routes
  router.use('/auth', authenticationController.init(disableAuthentication));

  router.post('/debug', bodyParser.json(), (req: Request, res: Response) => {
    console.log('req.body', req.body);
    res.send();
  });

  return router;
};
