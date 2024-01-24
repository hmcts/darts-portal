import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpBackendClient } from 'src/app/extensions/HttpBackendClient';

export interface AppConfig {
  appInsightsKey: string;
  support: {
    name: string;
    emailAddress: string;
  };
  environment: string;
}

const CONFIG_PATH = '/app/config';

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig | undefined;

  constructor(private http: HttpBackendClient) {}

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
