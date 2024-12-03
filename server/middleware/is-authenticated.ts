import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { AuthenticationUtils, Urls } from '../utils';

export default async (req: Request, res: Response) => {
  const expiry = req.session?.expiry;
  const sessionExpired = expiry && DateTime.now() > DateTime.fromISO(expiry);
  const userIdNotPresent = !req.session.securityToken?.userState?.userId;

  if (sessionExpired || userIdNotPresent) {
    console.log('Session expired or userId not found.');
    res.sendStatus(401);
    return;
  }
  if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken)) {
    const refreshToken = req.session.securityToken?.refreshToken;
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }
    try {
      const securityToken = await AuthenticationUtils.refreshJwt(
        Urls.getRefreshAccessTokenUrl(req.session.userType!),
        refreshToken!
      );
      req.session.securityToken = securityToken;
      console.log('Refreshed access token using refresh token');
    } catch (err) {
      console.log('Error refreshing access token using refresh token', err);
      throw err;
    }
  }
};
