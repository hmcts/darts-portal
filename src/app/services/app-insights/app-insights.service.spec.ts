import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppInsightsService } from './app-insights.service';

describe('AppInsightsService', () => {
  it('loads Application Insights', () => {
    const spy = spyOn(ApplicationInsights.prototype, 'loadAppInsights');

    new AppInsightsService();

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
  });

  it('logs a page view', () => {
    const spy = spyOn(ApplicationInsights.prototype, 'trackPageView');

    const appInsightsService = new AppInsightsService();
    appInsightsService.logPageView('TEST_PAGE', 'http://localhost:3000/test-page');

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
    expect(spy.calls.first().args).toEqual([{ name: 'TEST_PAGE', uri: 'http://localhost:3000/test-page' }]);
  });

  it('logs an event', () => {
    const spy = spyOn(ApplicationInsights.prototype, 'trackEvent');

    const appInsightsService = new AppInsightsService();
    const eventProps = { caseId: 'CASE1001', eventId: 'TRANSCRIPTION_APPROVED' };
    appInsightsService.logEvent('TEST_EVENT', eventProps);

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
    expect(spy.calls.first().args).toEqual([{ name: 'TEST_EVENT' }, eventProps]);
  });

  it('logs a metric', () => {
    const spy = spyOn(ApplicationInsights.prototype, 'trackMetric');

    const appInsightsService = new AppInsightsService();
    const metricProps = { caseId: 'CASE1001' };
    appInsightsService.logMetric('ACCEPT_TRANSCRIPTION_REQUEST', 60, metricProps);

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
    expect(spy.calls.first().args).toEqual([{ name: 'ACCEPT_TRANSCRIPTION_REQUEST', average: 60 }, metricProps]);
  });

  it('logs an exception', () => {
    const spy = spyOn(ApplicationInsights.prototype, 'trackException');

    const appInsightsService = new AppInsightsService();
    const err = new Error('BAD_ERROR');
    appInsightsService.logException(err, 1);

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
    expect(spy.calls.first().args).toEqual([{ exception: err, severityLevel: 1 }]);
  });

  it('logs a trace', () => {
    const spy = spyOn(ApplicationInsights.prototype, 'trackTrace');

    const appInsightsService = new AppInsightsService();
    const traceProps = { caseId: 'CASE1001' };
    appInsightsService.logTrace('SOME_TRACE', traceProps);

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
    expect(spy.calls.first().args).toEqual([{ message: 'SOME_TRACE' }, traceProps]);
  });
});
