import { Injectable } from '@angular/core';
import { HttpBackendClient } from '@extensions/HttpBackendClient';
import { lastValueFrom } from 'rxjs';

export interface AppConfig {
  appInsightsKey: string;
  support: {
    name: string;
    emailAddress: string;
  };
  environment: string;
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
  caseSearchTimeout: string;
}

const CONFIG_PATH = '/app/config';

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig | undefined;

  constructor(private readonly http: HttpBackendClient) {}

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
