import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { CookiesService } from '@services/cookies/cookies.service';
import { DynatraceService } from '@services/dynatrace/dynatrace.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { UserService } from '@services/user/user.service';
import { filter } from 'rxjs';
import { CookieBannerComponent } from '../cookies/cookie-banner/cookie-banner.component';
import { ContentComponent } from '../layout/content/content.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, ContentComponent, FooterComponent, RouterLink, CookieBannerComponent],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private appInsightsService = inject(AppInsightsService);
  private dynatraceService = inject(DynatraceService);
  private userService = inject(UserService);
  private cookiesService = inject(CookiesService);
  private errorMessageService = inject(ErrorMessageService);

  public showCookieBanner: boolean = false;

  title = 'DARTS portal';
  currentUrl = '';
  ngOnInit() {
    // If url changes show navigation in case it is hidden
    // This is useful if a user improperly navigates away from a confirmation screen
    // via the browser back button, for example.
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e) => {
      this.currentUrl = (e as NavigationEnd).url.split('#')[0];
      this.headerService.showNavigation();
      // log the page view with app insights
      this.appInsightsService.logPageView(this.currentUrl, this.currentUrl);
      // refresh the user profile/userstate, including roles/permissions
      this.userService.refreshUserProfile();
      // clear any error messages on route change
      this.errorMessageService.clearErrorMessage();
    });
    this.dynatraceService.addDynatraceScript();
    this.showCookieBanner = !this.cookiesService.doesCookiePolicyExist();
  }
}
