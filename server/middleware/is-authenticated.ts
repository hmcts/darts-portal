import { Request } from 'express';
import { AuthenticationUtils, Urls } from '../utils';

export default async (req: Request): Promise<void> => {
  if (!AuthenticationUtils.isValidSession(req)) {
    console.log('Session expired or userId not found. IS-AUTHENTICATED.TS');
    throw new Error('Not authenticated');
  }

  if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken)) {
    const refreshToken = req.session?.securityToken?.refreshToken;
    if (!refreshToken) {
      throw new Error('Not authenticated');
    }

    try {
      req.session.securityToken = await AuthenticationUtils.refreshJwt(
        Urls.getRefreshAccessTokenUrl(req.session.userType!),
        refreshToken
      );
      console.log('Refreshed access token using refresh token');
    } catch (err) {
      console.error('Error refreshing access token:', err);
      throw new Error('Not authenticated');
    }
  }
};
