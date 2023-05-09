import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export interface AppConfig {
  appInsightsKey: string;
}

const CONFIG_PATH = '/app/config';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: AppConfig | undefined;

  constructor(private readonly http: HttpClient) {}

  async loadAppConfig(): Promise<void> {
    console.log('loading app config');
    this.appConfig = await lastValueFrom(this.http.get<AppConfig>(CONFIG_PATH));
    console.log('loading app config', this.appConfig);
  }

  getAppConfig(): AppConfig | undefined {
    return this.appConfig;
  }
}
