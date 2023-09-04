import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AppInsightsService {
  appInsights: ApplicationInsights;

  constructor(private readonly appConfigService: AppConfigService) {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: this.appConfigService.getAppConfig()?.appInsightsKey,
        enableAutoRouteTracking: true, // option to log all route changes
      },
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(name?: string, url?: string) {
    this.appInsights.trackPageView({
      name: name,
      uri: url,
    });
  }

  logEvent(name: string, properties?: { [key: string]: unknown }) {
    this.appInsights.trackEvent({ name: name }, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: unknown }) {
    this.appInsights.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: unknown }) {
    this.appInsights.trackTrace({ message: message }, properties);
  }
}
