import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  // TODO: change to check session.accessToken, once we have it
  if (!req.session.authenticated) {
    res.redirect('/login');
  } else {
    next();
  }
};
