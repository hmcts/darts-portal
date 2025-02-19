import { NextFunction, Request, Response } from 'express';
import { AuthenticationUtils } from '../utils/authentication-utils';
import { DateTime } from 'luxon';

export default (req: Request, res: Response, next: NextFunction): void => {
  // temporary code for testing keep-alive request, to be removed
  if (req.url === '/keep-alive-test' || req.url === '/keep-alive-test-stream') {
    return next();
  }
  // temporary code for testing keep-alive request, to be removed

  const expiry = req.session?.expiry;
  const sessionExpired = expiry && DateTime.now() > DateTime.fromISO(expiry);
  if (
    AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken) ||
    !req.session.securityToken?.userState?.userId ||
    sessionExpired
  ) {
    res.sendStatus(401);
  } else {
    next();
  }
};
