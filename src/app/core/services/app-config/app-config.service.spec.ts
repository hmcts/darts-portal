import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfig, AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads app config', async () => {
    const mockConfig: AppConfig = {
      appInsightsKey: 'TestKey',
      support: {
        name: 'DARTS Support',
        emailAddress: 'support@darts',
      },
      environment: 'development',
      version: '0.0.1',
      dynatrace: { scriptUrl: 'script' },
      features: {
        manualDeletion: { enabled: 'false' },
        eventObfuscation: { enabled: 'false' },
      },
      caseSearchTimeout: '30 seconds',
      pagination: {
        courtLogEventsPageLimit: 500,
      },
    };

    const resultPromise = service.loadAppConfig();

    const req = httpMock.expectOne('/app/config');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);

    await resultPromise;

    expect(service.getAppConfig()).toEqual(mockConfig);
  });

  it('#isDevelopment should return true when environment is development', () => {
    // @ts-expect-error testing private value directly
    service['appConfig'] = {
      appInsightsKey: 'key',
      support: { name: '', emailAddress: '' },
      environment: 'development',
    };

    expect(service.isDevelopment()).toBe(true);
  });
});
