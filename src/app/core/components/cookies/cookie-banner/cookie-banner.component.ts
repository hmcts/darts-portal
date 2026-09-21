import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CookiesService } from '@services/cookies/cookies.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [],
  templateUrl: './cookie-banner.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  private cookiesService = inject(CookiesService);
  cookieResponse: string | null = null;
  hideConfirmBanner: boolean = false;

  rejectCookies() {
    this.cookieResponse = 'rejected';
    this.cookiesService.setCookiePolicy(false, false);
  }

  acceptCookies() {
    this.cookieResponse = 'accepted';
    this.cookiesService.setCookiePolicy(true, true);
  }
}
