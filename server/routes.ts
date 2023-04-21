import express from 'express';

import type { Router } from 'express';

import * as apiController from './controllers/api';

export default (): Router => {
  const router = express.Router();

  router.use(apiController.init());

  return router;
};
