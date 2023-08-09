import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session?.securityToken?.accessToken) {
    res.redirect('/login');
  } else {
    next();
  }
};
