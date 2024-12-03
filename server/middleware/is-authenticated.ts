import { Request } from 'express';
import { DateTime } from 'luxon';
import { AuthenticationUtils, Urls } from '../utils';

export default async (req: Request) => {
  const expiry = req.session?.expiry;
  const sessionExpired = expiry && DateTime.now() > DateTime.fromISO(expiry);
  const userIdNotPresent = !req.session.securityToken?.userState?.userId;
  const refreshToken = req.session.securityToken?.refreshToken;

  if (sessionExpired || userIdNotPresent || !refreshToken) {
    throw new Error('Session expired, userId not found, or refresh token not found');
  }
  if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken)) {
    try {
      const securityToken = await AuthenticationUtils.refreshJwt(
        Urls.getRefreshAccessTokenUrl(req.session.userType!),
        refreshToken
      );
      req.session.securityToken = securityToken;
      console.log('Refreshed access token using refresh token');
    } catch (err) {
      console.log('Error refreshing access token using refresh token', err);
      throw err;
    }
  }
};
