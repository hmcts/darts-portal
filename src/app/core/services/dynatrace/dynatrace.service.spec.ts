import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CookiesService } from '@services/cookies/cookies.service';
import { DynatraceService } from './dynatrace.service';

describe('DynatraceService', () => {
  let service: DynatraceService;
  let cookiesService: CookiesService;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    const mockCookiesService = {
      getCookiePolicy: jest.fn(),
    };
    const mockAppConfigService = {
      getAppConfig: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DynatraceService,
        { provide: CookiesService, useValue: mockCookiesService },
        { provide: AppConfigService, useValue: mockAppConfigService },
      ],
    });

    service = TestBed.inject(DynatraceService);
    cookiesService = TestBed.inject(CookiesService);
    appConfigService = TestBed.inject(AppConfigService);
  });

  it('should not add the Dynatrace script if cookie policy disallows it', () => {
    jest
      .spyOn(cookiesService, 'getCookiePolicy')
      .mockReturnValue({ dynatraceCookiesEnabled: false, appInsightsCookiesEnabled: false });
    service.addDynatraceScript();
    expect(document.getElementById('dynatrace-script')).toBeNull();
  });

  it('should add the Dynatrace script if cookie policy allows it', () => {
    jest
      .spyOn(cookiesService, 'getCookiePolicy')
      .mockReturnValue({ dynatraceCookiesEnabled: true, appInsightsCookiesEnabled: false });

    jest.spyOn(appConfigService, 'getAppConfig').mockReturnValue({
      dynatrace: { scriptUrl: 'https://dynatrace.com/script.js' },
      appInsightsKey: 'X',
      environment: 'env',
      support: { name: 'name', emailAddress: 'email' },
    });

    service.addDynatraceScript();

    const script = document.getElementById('dynatrace-script') as HTMLScriptElement;

    expect(script).not.toBeNull();
    expect(script?.src).toBe('https://dynatrace.com/script.js');
  });

  afterEach(() => {
    // Cleanup any script elements added to document.head to ensure tests are isolated
    const script = document.getElementById('dynatrace-script');
    script?.parentNode?.removeChild(script);
  });
});
