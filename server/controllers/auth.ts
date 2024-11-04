import config from 'config';
import * as express from 'express';
import { Request, Response, Router } from 'express';

/*
  This is for proof-of-concept purposes to see how Azure AD can use
  an HTML page from the portal.
*/
function getAzureAdLogin(req: Request, res: Response): void {
  res.header('Access-Control-Allow-Origin', config.get('authentication.azureAdB2cOriginHost'));
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // do this whilst the page is being developed to prevent caching on the platform
  res.header('Cache-Control', 'no-store, must-revalidate');
  res.render('azuread-b2c-login.html', {
    baseUrl: config.get('hostname'),
    hostname: config.get('authentication.azureAdB2cHostname'),
    screen: req.query.screenName,
  });
}

export function init(): Router {
  const router = express.Router();
  router.get('/auth/azuread-b2c-login', getAzureAdLogin);
  return router;
}
