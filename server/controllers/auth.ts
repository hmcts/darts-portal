import * as express from 'express';
import { Router, Request, Response } from 'express';
import config from 'config';

/*
  This is for proof-of-concept purposes to see how Azure AD can use
  an HTML page from the portal.
*/
function getAzureAdLogin(req: Request, res: Response): void {
  res.header('Access-Control-Allow-Origin', config.get('authentication.azureAdB2cOriginHost'));
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // do this whilst the page is being developed to prevent caching on the platform
  res.header('Cache-Control', 'no-store, must-revalidate');
  res.render('azuread-b2c-login.html', { hostname: config.get('hostname') });
}

export function init(): Router {
  const router = express.Router();
  router.get('/auth/azuread-b2c-login', getAzureAdLogin);
  return router;
}
