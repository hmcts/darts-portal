import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  appInsightCookies = ['ai_user', 'ai_session'];
  dyntraceCookies = ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'];
  cookieService = inject(CookieService);

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
    return this.cookieService.check('cookie_policy')
      ? JSON.parse(this.cookieService.get('cookie_policy'))
      : { appInsightsCookiesEnabled: false, dynatraceCookiesEnabled: false };
  }

  setCookiePolicy(appInsightsEnabled: boolean, dynatraceEnabled: boolean) {
    // 1 year expiry
    const expiryDate = DateTime.now().plus({ years: 1 }).toJSDate();
    const cookiePolicy = {
      appInsightsCookiesEnabled: appInsightsEnabled,
      dynatraceCookiesEnabled: dynatraceEnabled,
    };

    this.cookieService.set('cookie_policy', JSON.stringify(cookiePolicy), { expires: expiryDate, path: '/' });

    !appInsightsEnabled && this.deleteAppInsightsCookies();
    !dynatraceEnabled && this.deleteDynatraceCookies();
  }
}
