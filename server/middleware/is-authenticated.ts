import { NextFunction, Request, Response } from 'express';
import config from 'config';
import { DateTime } from 'luxon';
import { AuthenticationUtils } from '../utils/authentication-utils';

const EXTERNAL_REFRESH_ACCESS_TOKEN = `${config.get('darts-api.url')}/external-user/refresh-access-token`;
const INTERNAL_REFRESH_ACCESS_TOKEN = `${config.get('darts-api.url')}/internal-user/refresh-access-token`;

export default async (req: Request, res: Response, next: NextFunction) => {
  const expiry = req.session?.expiry;
  const sessionExpired = expiry && DateTime.now() > DateTime.fromISO(expiry);
  const userIdNotPresent = !req.session.securityToken?.userState?.userId;
  const refreshToken = req.session.securityToken?.refreshToken;

  console.log('is-authenticated::accessToken', req.session?.securityToken?.accessToken);
  if (sessionExpired || userIdNotPresent || !refreshToken) {
    console.log(
      'is-authenticated::FALSE sessionExpired=',
      sessionExpired,
      'userIdNotPresent=',
      userIdNotPresent,
      'refreshTokenPresent=',
      Boolean(refreshToken)
    );
    res.sendStatus(401);
    return;
  }
  if (AuthenticationUtils.isJwtExpired(req.session?.securityToken?.accessToken) || Math.random() <= 0.06) {
    const userType = req.session.userType;
    const url = userType === 'internal' ? INTERNAL_REFRESH_ACCESS_TOKEN : EXTERNAL_REFRESH_ACCESS_TOKEN;

    console.log('is-authenticated::JWT expired, using refresh token');
    try {
      const securityToken = await AuthenticationUtils.refreshJwt(url, refreshToken);
      console.log('is-authenticated::JWT expired, new securityToken', securityToken);
      req.session.securityToken = securityToken;
      next();
    } catch (err) {
      console.log('Error refreshing access token using refresh token', err);
      res.sendStatus(401);
    }
  } else {
    next();
  }
};
