import { TestBed } from '@angular/core/testing';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CookiesService } from '@services/cookies/cookies.service';
import { AppInsightsService } from './app-insights.service';

describe('AppInsightsService', () => {
  let service: AppInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppConfigService,
          useValue: {
            getAppConfig: () => ({
              appInsightsKey: 'XXXXXXXX',
            }),
          },
        },
        {
          provide: CookiesService,
          useValue: {
            getCookiePolicy: jest.fn(),
          },
        },
        AppInsightsService,
      ],
    });

    service = TestBed.inject(AppInsightsService);
  });

  it('logs a page view', () => {
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackPageView');

    service.logPageView('TEST_PAGE', 'http://localhost:3000/test-page');

    expect(spy).toHaveBeenCalledTimes(1);
    const pageViewParams = spy.mock.calls[0][0];
    expect(pageViewParams).toHaveProperty('name', 'TEST_PAGE');
    expect(pageViewParams).toHaveProperty('uri', 'http://localhost:3000/test-page');
    expect(pageViewParams).toHaveProperty('refUri');
    expect(pageViewParams).toHaveProperty('startTime');
  });

  it('logs an event', () => {
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackEvent');
    const eventProps = { caseId: 'CASE1001', eventId: 'TRANSCRIPTION_APPROVED' };

    service.logEvent('TEST_EVENT', eventProps);

    expect(spy).toHaveBeenCalledWith({ name: 'TEST_EVENT' }, eventProps);
  });

  it('logs a metric', () => {
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackMetric');

    service.logMetric('ACCEPT_TRANSCRIPTION_REQUEST', 60, { caseId: 'CASE1001' });

    expect(spy).toHaveBeenCalledWith({ name: 'ACCEPT_TRANSCRIPTION_REQUEST', average: 60 }, { caseId: 'CASE1001' });
  });

  it('logs an exception', () => {
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackException');

    const err = new Error('BAD_ERROR');
    service.logException(err, 1);

    expect(spy).toHaveBeenCalledWith({ exception: err, severityLevel: 1 });
  });

  it('logs a trace', () => {
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackTrace');
    const traceProps = { caseId: 'CASE1001' };

    service.logTrace('SOME_TRACE', traceProps);

    expect(spy).toHaveBeenCalledWith({ message: 'SOME_TRACE' }, traceProps);
  });
});
