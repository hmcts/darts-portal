import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from 'config';
import bodyParser from 'body-parser';

const EXTERNAL_USER_LOGIN = `${config.get('darts-api.url')}/external-user/login-or-refresh`;
const EXTERNAL_USER_CALLBACK = `${config.get('darts-api.url')}/external-user/handle-oauth-code`;
const EXTERNAL_USER_LOGOUT = `${config.get('darts-api.url')}/external-user/logout`;
const EXTERNAL_USER_INVALIDATE_SESSION = `${config.get('darts-api.url')}/external-user/invalidate-session`;

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
      console.error('Error on get login-or-refresh call', err);
      next(err);
    }
  };
}

function postAuthCallback(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.error) {
      console.error('Error received from Azure login callback', req.body);
      return res.redirect('/login');
    }
    try {
      const result = await axios.post<string>(EXTERNAL_USER_CALLBACK, req.body, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
      const accessToken = result.data;
      req.session.accessToken = accessToken;
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    } catch (err) {
      console.error('Error on authentication callback', err);
      next(err);
    }
  };
}

function getLogout(): (_: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const result = await axios(EXTERNAL_USER_LOGOUT);
      console.log('result.request.res.responseUrl', result.request.res.responseUrl);
      const logoutRedirect = result.request.res.responseUrl;
      if (logoutRedirect) {
        res.redirect(logoutRedirect);
      } else {
        next(new Error('Error trying to fetch logout page'));
      }
    } catch (err) {
      console.error('Error on get logout call', err);
      next(err);
    }
  };
}

function postLogoutCallback(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.error) {
      console.error('Error received from Azure logout callback', req.body);
      return res.redirect('/login');
    }
    try {
      await axios(EXTERNAL_USER_INVALIDATE_SESSION);
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/login');
      });
    } catch (err) {
      console.error('Error on logout callback', err);
      next(err);
    }
  };
}

function getIsAuthenticated(disableAuthentication = false): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    // don't allow caching of this endpoint
    res.header('Cache-Control', 'no-store, must-revalidate');
    if (req.session.accessToken || disableAuthentication) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  };
}

export function init(disableAuthentication = false): Router {
  const router = express.Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));
  router.get('/login', getLogin());
  router.post('/callback', postAuthCallback());
  router.get('/logout', getLogout());
  router.post('/logout-callback', postLogoutCallback());
  router.get('/is-authenticated', getIsAuthenticated(disableAuthentication));
  return router;
}
