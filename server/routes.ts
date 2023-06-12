import express from 'express';

import type { Router } from 'express';

import { apiController, appController, authController, authenticationController } from './controllers';
import { isAuthenticated } from './middleware';

export default (): Router => {
  const router = express.Router();

  // authenticated routes
  router.use('/api', isAuthenticated, apiController.init());

  // unauthenticated routes
  router.use('/auth', authenticationController.init());
  router.use('/app', appController.init());
  // TODO: rename this, or move into authentication controller
  router.use(authController.init());

  return router;
};
