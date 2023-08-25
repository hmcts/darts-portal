import { Request, Response, NextFunction } from 'express';
import { AuthenticationUtils } from '../utils/authentication-utils';

export default (req: Request, res: Response, next: NextFunction): void => {

  console.log('isAuthenticated')

  if (AuthenticationUtils.redirectLogin(req.session?.securityToken?.accessToken)){
    console.log(' jwt expired in is authenticated')
    res.sendStatus(401);
  } else {
    next();
  }
};
