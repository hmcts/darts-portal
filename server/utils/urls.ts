import config from 'config';

export class Urls {
  static dartsPortalUrl = config.get('hostname');
  static dartsApiUrl = config.get('darts-api.url');

  private static getAuthUrl(userType: 'internal' | 'external', action: string, appendCallback = true): string {
    const authUrlPath = config.get(`authentication.urlPaths.${userType}.${action}`);
    const callbackPath = userType === 'internal' ? '/auth/internal/callback' : '/auth/callback';

    return appendCallback
      ? `${Urls.dartsApiUrl}${authUrlPath}?redirect_uri=${Urls.dartsPortalUrl}${callbackPath}`
      : `${Urls.dartsApiUrl}${authUrlPath}`;
  }

  static getLoginUrl(userType: 'internal' | 'external'): string {
    return this.getAuthUrl(userType, 'login');
  }

  static getHandleOauthCodeUrl(userType: 'internal' | 'external'): string {
    return this.getAuthUrl(userType, 'handleOauthCode');
  }

  static getResetPasswordUrl(userType: 'external'): string {
    return this.getAuthUrl(userType, 'resetPwd');
  }

  static getLogoutUrl(userType: 'internal' | 'external'): string {
    return `${Urls.dartsApiUrl}${config.get<string>(`authentication.urlPaths.${userType}.logout`)}?redirect_uri=/logout-callback`;
  }

  static getRefreshAccessTokenUrl(userType: 'internal' | 'external'): string {
    return this.getAuthUrl(userType, 'refreshAccessToken', false);
  }
}
