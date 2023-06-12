import * as express from 'express';
import appConfig from '../app-config';
import { Router, Request, Response } from 'express';

function getAppConfig(): (req: Request, res: Response) => void {
  return (_: Request, res: Response) => {
    res.json({ ...appConfig() });
  };
}

export function init(): Router {
  const router = express.Router();
  router.get('/config', getAppConfig());
  return router;
}
