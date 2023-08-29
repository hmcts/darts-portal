import { Request, Response, NextFunction } from 'express';
import { AuthenticationUtils } from '../utils/authentication-utils';

export default (req: Request, res: Response, next: NextFunction): void => {
  if (AuthenticationUtils.redirectLogin(req.session?.securityToken?.accessToken)) {
    res.sendStatus(401);
  } else {
    next();
  }
};
