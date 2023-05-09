import express from 'express';

import type { Router } from 'express';

import * as apiController from './controllers/api';
import * as appController from './controllers/app';

export default (): Router => {
  const router = express.Router();

  router.use(apiController.init());
  router.use(appController.init());

  return router;
};
