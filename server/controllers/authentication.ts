import axios from 'axios';
import bodyParser from 'body-parser';
import config from 'config';
import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import { DateTime } from 'luxon';
import SecurityToken from '../types/classes/securityToken';
import { AuthenticationUtils, Urls } from '../utils';

const ERROR_CODES = {
  RESET_PWD: 'AADB2C90118',
};

function getLogin(type: 'internal' | 'external'): (_: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const result = await axios(Urls.getLoginUrl(type));
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
      const result = await axios(Urls.getResetPasswordUrl('external'), {
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
      const result = await axios.post<SecurityToken>(Urls.getHandleOauthCodeUrl(type), req.body, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
      const securityToken = result.data;
      req.session.regenerate((err) => {
        if (err) {
          return next(err);
        }
        req.session.userType = type;
        req.session.securityToken = securityToken;
        req.session.expiry = DateTime.now()
          .plus({ seconds: config.get('session.ttlInSeconds') })
          .toISO();
        if (req.session.securityToken.userState?.isActive) {
          res.redirect('/');
        } else {
          res.redirect('/forbidden');
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
      const result = await axios(Urls.getLogoutUrl(req.session.userType!), {
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

function logoutCallback(): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body && req.body.error) {
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
  return async (req: Request, res: Response) => {
    // don't allow caching of this endpoint
    res.header('Cache-Control', 'no-store, must-revalidate');

    if (disableAuthentication) {
      return res.status(200).send(true);
    }

    if (!AuthenticationUtils.isValidSession(req)) {
      console.log('Session expired or userId not found.');
      return res.status(200).send(false);
    }

    if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken)) {
      const refreshToken = req.session.securityToken?.refreshToken;
      if (!refreshToken) {
        return res.status(200).send(false);
      }

      const userType = req.session.userType;
      try {
        const securityToken = await AuthenticationUtils.refreshJwt(
          Urls.getRefreshAccessTokenUrl(userType!),
          refreshToken as string
        );
        req.session.securityToken = securityToken;
        console.log('Refreshed access token using refresh token');
        return res.status(200).send(true);
      } catch (err) {
        console.log('Error refreshing access token using refresh token', err);
        return res.status(200).send(false);
      }
    } else {
      return res.status(200).send(true);
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
