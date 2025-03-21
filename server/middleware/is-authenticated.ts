import { Request, Response } from 'express';
import { AuthenticationUtils, Urls } from '../utils';

export default async (req: Request, res: Response): Promise<void> => {
  if (!AuthenticationUtils.isValidSession(req)) {
    console.log('Session expired or userId not found. IS-AUTHENTICATED.TS');
    res.sendStatus(401);
    return;
  }

  if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken)) {
    const refreshToken = req.session?.securityToken?.refreshToken;
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    try {
      req.session.securityToken = await AuthenticationUtils.refreshJwt(
        Urls.getRefreshAccessTokenUrl(req.session.userType!),
        refreshToken
      );
      console.log('Refreshed access token using refresh token');
    } catch (err) {
      console.error('Error refreshing access token:', err);
      res.sendStatus(401);
    }
  }
};
