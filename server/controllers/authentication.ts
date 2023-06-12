import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from 'config';

const EXTERNAL_USER_LOGIN = `${config.get('darts-api.url')}/external-user/login-or-refresh`;
const EXTERNAL_USER_CALLBACK = `${config.get('darts-api.url')}/external-user/handle-oauth-code`;

function getLogin(): (_: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const result = await axios(EXTERNAL_USER_LOGIN);
      const loginRedirect = result.request.res.responseUrl;
      if (loginRedirect) {
        res.redirect(loginRedirect);
      } else {
        next(new Error('Error trying to fetch login page'));
      }
    } catch (err) {
      console.error('Error on authentication callback', err);
      next(err);
    }
  };
}

function postAuthCallback(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = axios.post(EXTERNAL_USER_CALLBACK, req.body);
      // TODO: result should contain the access token, store this in the session
      req.session.authenticated = true;
      res.redirect('/');
    } catch (err) {
      console.error('Error on authentication callback', err);
      next(err);
    }
  };
}

function getLogout(req: Request, res: Response, next: NextFunction) {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send();
    }
  });
}

function getIsAuthenticated(disableAuthentication = false): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    if (req.session.authenticated || disableAuthentication) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  };
}

export function init(disableAuthentication = false): Router {
  const router = express.Router();
  router.get('/login', getLogin());
  router.post('/callback', postAuthCallback());
  router.get('/logout', getLogout);
  router.get('/is-authenticated', getIsAuthenticated(disableAuthentication));
  return router;
}
