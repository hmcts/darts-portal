import config from 'config';

export class Urls {
  static dartsPortalUrl = config.get('hostname');
  static dartsApiUrl = config.get('darts-api.url');

  static getLoginUrl(userType: 'internal' | 'external'): string {
    const authUrlPath = config.get(`authentication.urlPaths.${userType}.login`);
    const callbackPath = userType === 'internal' ? '/auth/internal/callback' : '/auth/callback';
    return `${Urls.dartsApiUrl}${authUrlPath}?redirect_uri=${Urls.dartsPortalUrl}${callbackPath}`;
  }

  static getHandleOauthCodeUrl(userType: 'internal' | 'external'): string {
    const authUrlPath = config.get(`authentication.urlPaths.${userType}.handleOauthCode`);
    const callbackPath = userType === 'internal' ? '/auth/internal/callback' : '/auth/callback';
    return `${Urls.dartsApiUrl}${authUrlPath}?redirect_uri=${Urls.dartsPortalUrl}${callbackPath}`;
  }

  static getResetPasswordUrl(userType: 'external'): string {
    const authUrlPath = config.get(`authentication.urlPaths.${userType}.resetPwd`);
    return `${Urls.dartsApiUrl}${authUrlPath}?redirect_uri=${Urls.dartsPortalUrl}/auth/callback`;
  }

  static getLogoutUrl(userType: 'internal' | 'external'): string {
    const authUrlPath = config.get(`authentication.urlPaths.${userType}.logout`);
    return `${Urls.dartsApiUrl}${authUrlPath}?redirect_uri=/logout-callback`;
  }

  static getRefreshAccessTokenUrl(userType: 'internal' | 'external'): string {
    const authUrlPath = config.get(`authentication.urlPaths.${userType}.refreshAccessToken`);
    return `${Urls.dartsApiUrl}${authUrlPath}`;
  }
}
