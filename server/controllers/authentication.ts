import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from 'config';
import bodyParser from 'body-parser';
import SecurityToken from 'server/types/classes/securityToken';
import { AuthenticationUtils } from '../utils/authentication-utils';

const ERROR_CODES = {
  RESET_PWD: 'AADB2C90118',
};

const EXTERNAL_USER_LOGIN = `${config.get('darts-api.url')}/external-user/login-or-refresh`;
const EXTERNAL_USER_CALLBACK = `${config.get('darts-api.url')}/external-user/handle-oauth-code`;
const EXTERNAL_USER_RESET_PWD = `${config.get('darts-api.url')}/external-user/reset-password`;
const EXTERNAL_USER_LOGOUT = `${config.get('darts-api.url')}/external-user/logout`;

const INTERNAL_USER_LOGIN = `${config.get('darts-api.url')}/internal-user/login-or-refresh`;
const INTERNAL_USER_LOGOUT = `${config.get('darts-api.url')}/internal-user/logout`;
const INTERNAL_USER_CALLBACK = `${config.get('darts-api.url')}/internal-user/handle-oauth-code`;

function getLogin(type: 'internal' | 'external'): (_: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const url =
        type === 'internal'
          ? `${INTERNAL_USER_LOGIN}?redirect_uri=${config.get('hostname')}/auth/internal/callback`
          : `${EXTERNAL_USER_LOGIN}?redirect_uri=${config.get('hostname')}/auth/callback`;
      const result = await axios(url);
      const loginRedirect = result.request.res.responseUrl;
      if (loginRedirect) {
        res.redirect(loginRedirect);
      } else {
        next(new Error('Error trying to fetch login page'));
      }
    } catch (err) {
      console.error(`Error on get ${type} login-or-refresh call`, err);
      next(err);
    }
  };
}

async function handleResetPassword(req: Request): Promise<string> {
  if (req.body.error_description.startsWith(ERROR_CODES.RESET_PWD)) {
    try {
      let accessToken;
      if (req.session.securityToken) {
        accessToken = req.session.securityToken.accessToken;
      }
      const result = await axios(`${EXTERNAL_USER_RESET_PWD}?redirect_uri=${config.get('hostname')}/auth/callback`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const resetPwdRedirect = result.request.res.responseUrl;
      if (resetPwdRedirect) {
        return resetPwdRedirect;
      }
      throw new Error('Reset password redirect not found');
    } catch (err) {
      console.error('Error on get reset-password call', err);
      throw err;
    }
  }
  throw new Error(req.body);
}

function postAuthCallback(
  type: 'internal' | 'external'
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.error) {
      try {
        const resetPwdRedirect = await handleResetPassword(req);
        return res.redirect(resetPwdRedirect);
      } catch (err) {
        console.error('Error received from Azure login callback', req.body);
        return res.redirect('/login');
      }
    }
    try {
      const url = type === 'internal' ? INTERNAL_USER_CALLBACK : EXTERNAL_USER_CALLBACK;
      const result = await axios.post<SecurityToken>(url, req.body, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
      const securityToken = result.data;
      req.session.userType = type;
      req.session.securityToken = securityToken;
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        if (req.session?.bootstrapAuthOrigin && config.get('authentication.allowAuthBootstrapping') === 'true') {
          axios.post<void>(req.session?.bootstrapAuthOrigin + '/bootstrap-auth', result.data);
        } else {
          res.redirect('/');
        }
      });
    } catch (err) {
      console.error('Error on authentication callback', err);
      next(err);
    }
  };
}

function getAuthCallback(_: Request, res: Response) {
  res.redirect('/');
}

function getLogout(): (_: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let accessToken;
      if (req.session.securityToken) {
        accessToken = req.session.securityToken.accessToken;
      }

      const logoutUrl = req.session.userType === 'internal' ? INTERNAL_USER_LOGOUT : EXTERNAL_USER_LOGOUT;
      const result = await axios(`${logoutUrl}?redirect_uri=${config.get('hostname')}/auth/logout-callback`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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

function logoutCallback(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.error) {
      console.error('Error received from Azure logout callback', req.body);
      return res.redirect('/login');
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  };
}

function getIsAuthenticated(disableAuthentication = false): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    // don't allow caching of this endpoint
    res.header('Cache-Control', 'no-store, must-revalidate');

    if (!AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken) || disableAuthentication) {
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
  router.get('/internal/login', getLogin('internal'));
  router.get('/internal/callback', getAuthCallback);
  router.post('/internal/callback', postAuthCallback('internal'));
  router.get('/login', getLogin('external'));
  // this is used when cancelling a password reset
  router.get('/callback', getAuthCallback);
  router.post('/callback', postAuthCallback('external'));
  router.get('/logout', getLogout());
  router.get('/logout-callback', logoutCallback());
  router.post('/logout-callback', logoutCallback());
  router.get('/is-authenticated', getIsAuthenticated(disableAuthentication));
  return router;
}
export { AuthenticationUtils };
