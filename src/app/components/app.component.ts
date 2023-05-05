import { Component } from '@angular/core';
import { AppInsightsService } from '../services/app-insights/app-insights.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DARTS portal';
  constructor(private appInsightsService: AppInsightsService) {}
}
