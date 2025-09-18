import { Injectable, inject } from '@angular/core';
import { HttpBackendClient } from '@extensions/HttpBackendClient';
import { lastValueFrom } from 'rxjs';

export interface AppConfig {
  appInsightsKey: string;
  support: {
    name: string;
    emailAddress: string;
  };
  environment: string;
  version: string;
  dynatrace: {
    scriptUrl: string;
  };
  features: {
    manualDeletion: {
      enabled: string;
    };
    eventObfuscation: {
      enabled: string;
    };
  };
  pagination: {
    courtLogEventsPageLimit: number;
    caseAudiosPageLimit?: number;
  };
  caseSearchTimeout: string;
}

const CONFIG_PATH = '/app/config';

@Injectable()
export class AppConfigService {
  private readonly http = inject(HttpBackendClient);

  private appConfig: AppConfig | undefined;

  async loadAppConfig(): Promise<void> {
    this.appConfig = await lastValueFrom(this.http.get<AppConfig>(CONFIG_PATH));
  }

  getAppConfig(): AppConfig | undefined {
    return this.appConfig;
  }

  isDevelopment(): boolean {
    return this.appConfig?.environment.toLowerCase() === 'development';
  }
}
