import { NextFunction, Request, Response } from 'express';
import { AuthenticationUtils } from '../utils/authentication-utils';

export default (req: Request, res: Response, next: NextFunction): void => {
  if (
    AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken) ||
    !req.session.securityToken?.userState?.userId
  ) {
    res.sendStatus(401);
  } else {
    next();
  }
};
