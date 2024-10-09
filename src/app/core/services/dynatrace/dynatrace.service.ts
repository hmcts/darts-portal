import { Injectable, inject } from '@angular/core';
import { dtrum } from '@dynatrace/dtrum-api-types';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CookiesService } from '@services/cookies/cookies.service';

interface Window {
  dtrum: dtrum;
}

@Injectable({
  providedIn: 'root',
})
export class DynatraceService {
  cookieService = inject(CookiesService);
  appConfigService = inject(AppConfigService);

  addDynatraceScript(): void {
    if (this.appConfigService.getAppConfig()?.dynatrace?.scriptUrl && !document.getElementById('dynatrace-script')) {
      const script = document.createElement('script');
      script.id = 'dynatrace-script';
      script.type = 'text/javascript';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = this.appConfigService.getAppConfig()!.dynatrace?.scriptUrl;
      document.head.appendChild(script);

      script.onload = () => {
        if (this.cookieService.getCookiePolicy()?.dynatraceCookiesEnabled) {
          (window as Window).dtrum?.enable();
        } else {
          (window as Window).dtrum?.disable();
        }
      };
    }
  }
}
