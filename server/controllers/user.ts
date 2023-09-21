import * as express from 'express';
import { Router, Request, Response } from 'express';

export function init(): Router {
  const router = express.Router();
  router.get('/profile', (req: Request, res: Response) => res.json(req.session.securityToken?.userState));
  return router;
}
