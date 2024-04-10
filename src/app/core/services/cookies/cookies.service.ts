import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { CookieService } from 'ngx-cookie-service';

export interface CookiePolicy {
  appInsightsCookiesEnabled: boolean;
  dynatraceCookiesEnabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  appInsightCookies = ['ai_user', 'ai_session'];
  dyntraceCookies = ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'];
  cookieService = inject(CookieService);
  cookiePolicy: CookiePolicy | undefined;

  deleteAppInsightsCookies() {
    this.appInsightCookies.forEach((cookieName) => {
      this.cookieService.delete(cookieName);
    });
  }

  deleteDynatraceCookies() {
    this.dyntraceCookies.forEach((cookieName) => {
      this.cookieService.delete(cookieName);
    });
  }

  getCookiePolicy() {
    if (!this.cookiePolicy) {
      this.cookiePolicy = this.cookieService.check('cookie_policy')
        ? JSON.parse(this.cookieService.get('cookie_policy'))
        : { appInsightsCookiesEnabled: false, dynatraceCookiesEnabled: false };
    }
    return this.cookiePolicy;
  }

  setCookiePolicy(appInsightsEnabled: boolean, dynatraceEnabled: boolean) {
    const expiryDate = DateTime.now().plus({ years: 1 }).toJSDate();
    const cookiePolicy = {
      appInsightsCookiesEnabled: appInsightsEnabled,
      dynatraceCookiesEnabled: dynatraceEnabled,
    };

    this.cookiePolicy = cookiePolicy;
    this.cookieService.set('cookie_policy', JSON.stringify(cookiePolicy), {
      expires: expiryDate,
      path: '/',
      sameSite: 'Strict',
      secure: true,
    });

    !appInsightsEnabled && this.deleteAppInsightsCookies();
    !dynatraceEnabled && this.deleteDynatraceCookies();
  }
}
