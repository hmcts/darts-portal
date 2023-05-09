import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { AppConfig, AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    appConfigService = new AppConfigService(httpClientSpy);
  });

  it('should be created', () => {
    expect(appConfigService).toBeTruthy();
  });

  it('loads app config', async () => {
    const testData: AppConfig = { appInsightsKey: 'Test Data' };
    httpClientSpy.get.and.returnValue(of(testData));
    await appConfigService.loadAppConfig();

    expect(appConfigService.getAppConfig()).toEqual(testData);
  });
});
