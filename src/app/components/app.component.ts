import { Component } from '@angular/core';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
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
  constructor(private appInsightsService: AppInsightsService) {}
}
