import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { AppConfig, AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let httpClientSpy: HttpClient;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;
    appConfigService = new AppConfigService(httpClientSpy);
  });

  it('should be created', () => {
    expect(appConfigService).toBeTruthy();
  });

  it('loads app config', async () => {
    const testData: AppConfig = {
      appInsightsKey: 'Test Data',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    };
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(testData));
    await appConfigService.loadAppConfig();

    expect(appConfigService.getAppConfig()).toEqual(testData);
  });
});
