import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { HeaderService } from '@services/header/header.service';
import { filter } from 'rxjs';
import { ContentComponent } from './layout/content/content.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { PhaseBannerComponent } from './layout/phase-banner/phase-banner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, PhaseBannerComponent, ContentComponent, FooterComponent],
})
export class AppComponent {
  title = 'DARTS portal';
  constructor(
    private appInsightsService: AppInsightsService,
    private headerService: HeaderService,
    private router: Router
  ) {
    // If url changes show navigation in case it is hidden
    // This is useful if a user improperly navigates away from a confirmation screen
    // via the browser back button, for example.
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.headerService.showNavigation());
  }
}
