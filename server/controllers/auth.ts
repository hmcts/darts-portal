import * as express from 'express';
import { Router, Request, Response } from 'express';

/*
  This is for proof-of-concept purposes to see how Azure AD can use
  an HTML page from the portal.
*/
function getAzureAdLogin(req: Request, res: Response): void {
  res.render('azuread-login.html');
}

export function init(): Router {
  const router = express.Router();
  router.use('/auth/azuread-login', getAzureAdLogin);
  return router;
}
