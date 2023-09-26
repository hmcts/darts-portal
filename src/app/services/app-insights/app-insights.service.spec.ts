import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from './app-insights.service';

describe('AppInsightsService', () => {
  const fakeAppConfigService = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
    }),
  } as AppConfigService;

  it('logs a page view', () => {
    const appInsightsService = new AppInsightsService(fakeAppConfigService);
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackPageView');

    appInsightsService.logPageView('TEST_PAGE', 'http://localhost:3000/test-page');

    expect(spy).toBeCalledTimes(1);
    const pageViewParams = spy.mock.calls[0][0];
    expect(pageViewParams).toHaveProperty('name', 'TEST_PAGE');
    expect(pageViewParams).toHaveProperty('uri', 'http://localhost:3000/test-page');
    expect(pageViewParams).toHaveProperty('refUri');
    expect(pageViewParams).toHaveProperty('startTime');
  });

  it('logs an event', () => {
    const appInsightsService = new AppInsightsService(fakeAppConfigService);
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackEvent');

    const eventProps = { caseId: 'CASE1001', eventId: 'TRANSCRIPTION_APPROVED' };
    appInsightsService.logEvent('TEST_EVENT', eventProps);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ name: 'TEST_EVENT' }, eventProps);
  });

  it('logs a metric', () => {
    const appInsightsService = new AppInsightsService(fakeAppConfigService);
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackMetric');

    const metricProps = { caseId: 'CASE1001' };
    appInsightsService.logMetric('ACCEPT_TRANSCRIPTION_REQUEST', 60, metricProps);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ name: 'ACCEPT_TRANSCRIPTION_REQUEST', average: 60 }, metricProps);
  });

  it('logs an exception', () => {
    const appInsightsService = new AppInsightsService(fakeAppConfigService);
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackException');

    const err = new Error('BAD_ERROR');
    appInsightsService.logException(err, 1);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ exception: err, severityLevel: 1 });
  });

  it('logs a trace', () => {
    const appInsightsService = new AppInsightsService(fakeAppConfigService);
    const spy = jest.spyOn(ApplicationInsights.prototype, 'trackTrace');

    const traceProps = { caseId: 'CASE1001' };
    appInsightsService.logTrace('SOME_TRACE', traceProps);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ message: 'SOME_TRACE' }, traceProps);
  });
});
