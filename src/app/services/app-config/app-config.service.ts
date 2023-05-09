import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

interface AppConfig {
  appInsightsKey: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: AppConfig | undefined;

  constructor(private readonly http: HttpClient) {}

  async loadAppConfig(configPath: string): Promise<void> {
    this.appConfig = await lastValueFrom(this.http.get<AppConfig>(configPath));
  }

  getAppConfig(): AppConfig | undefined {
    return this.appConfig;
  }
}
