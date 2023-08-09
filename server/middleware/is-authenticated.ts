import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  let login = true;

  if (req.session.securityToken) {
    if (req.session.securityToken.accessToken) {
      login = false;
    }
  }

  if (login) {
    res.redirect('/login');
  } else {
    next();
  }
};
