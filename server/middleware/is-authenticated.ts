import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.accessToken) {
    res.redirect('/login');
  } else {
    next();
  }
};
