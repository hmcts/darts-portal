import * as express from 'express';
import { appInsightsKey } from '../config';
import { Router, Request, Response } from 'express';

function appConfig(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    res.json({ appInsightsKey });
  };
}

export function init(): Router {
  const router = express.Router();
  router.use('/app/config', appConfig());
  return router;
}
