import { Injectable, inject } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CookiesService } from '@services/cookies/cookies.service';

@Injectable({
  providedIn: 'root',
})
export class DynatraceService {
  cookieService = inject(CookiesService);
  appConfigService = inject(AppConfigService);

  addDynatraceScript(): void {
    if (
      this.cookieService.getCookiePolicy()?.dynatraceCookiesEnabled &&
      this.appConfigService.getAppConfig()?.dynatraceScriptUrl &&
      !document.getElementById('dynatrace-script')
    ) {
      const script = document.createElement('script');
      script.id = 'dynatrace-script';
      script.type = 'text/javascript';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = this.appConfigService.getAppConfig()!.dynatraceScriptUrl;
      document.head.appendChild(script);
    }
  }
}
