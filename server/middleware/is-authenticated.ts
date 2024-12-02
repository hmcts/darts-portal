import { NextFunction, Request, Response } from 'express';
import { AuthenticationUtils } from '../utils/authentication-utils';
import { DateTime } from 'luxon';

export default (req: Request, res: Response, next: NextFunction): void => {
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
