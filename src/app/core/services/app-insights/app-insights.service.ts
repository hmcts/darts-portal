import { Injectable } from '@angular/core';
import { ApplicationInsights, ITelemetryItem } from '@microsoft/applicationinsights-web';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';

@Injectable()
export class AppInsightsService {
  appInsights: ApplicationInsights;
  private readonly cloudRoleName = 'DARTS portal';

  constructor(private readonly appConfigService: AppConfigService) {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: this.appConfigService.getAppConfig()?.appInsightsKey,
        enableAutoRouteTracking: true, // option to log all route changes
      },
    });
    const telemetryInitializer = (envelope: ITelemetryItem) => {
      if (envelope.tags && envelope.tags['ai.cloud.role']) {
        envelope.tags['ai.cloud.role'] = this.cloudRoleName;
      } else {
        envelope.tags = [
          {
            'ai.cloud.role': this.cloudRoleName,
          },
        ];
      }
    };
    this.appInsights.addTelemetryInitializer(telemetryInitializer);
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