import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpBackendClient } from 'src/app/extensions/HttpBackendClient';

export interface AppConfig {
  appInsightsKey: string;
}

const CONFIG_PATH = '/app/config';

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig | undefined;

  constructor(private http: HttpBackendClient) {}

  async loadAppConfig(): Promise<void> {
    console.log('loading app config');
    this.appConfig = await lastValueFrom(this.http.get<AppConfig>(CONFIG_PATH));
    console.log('loading app config', this.appConfig);
  }

  getAppConfig(): AppConfig | undefined {
    return this.appConfig;
  }
}
