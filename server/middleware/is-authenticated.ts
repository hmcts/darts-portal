import { Request } from 'express';
import { trackException, trackTrace } from '../app-insights';
import { AuthenticationUtils, Urls } from '../utils';

export default async (req: Request): Promise<void> => {
  if (!AuthenticationUtils.isValidSession(req)) {
    trackTrace('Auth: invalid session or missing userId', {
      route: req.originalUrl,
      method: req.method,
      source: 'is-authenticated',
      reason: 'invalid-session',
    });
    throw new Error('Not authenticated');
  }

  if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken)) {
    const refreshToken = req.session?.securityToken?.refreshToken;
    if (!refreshToken) {
      console.log('Session expired or userId not found. IS-AUTHENTICATED.TS');

      trackTrace('Auth: missing refresh token', {
        route: req.originalUrl,
        method: req.method,
        source: 'is-authenticated',
        reason: 'missing-refresh-token',
      });

      throw new Error('Not authenticated');
    }

    try {
      req.session.securityToken = await AuthenticationUtils.refreshJwt(
        Urls.getRefreshAccessTokenUrl(req.session.userType!),
        refreshToken
      );
      console.log('Refreshed access token using refresh token');

      trackTrace('Auth: refreshed access token', {
        route: req.originalUrl,
        method: req.method,
        source: 'is-authenticated',
      });
    } catch (err) {
      console.error('Error refreshing access token:', err);

      trackException(err as Error, {
        route: req.originalUrl,
        method: req.method,
        source: 'is-authenticated',
        stage: 'refreshJwt',
        hasRefreshToken: true,
      });
      throw new Error('Not authenticated');
    }
  }
};
