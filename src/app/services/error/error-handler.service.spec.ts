import { AppInsightsService } from '../app-insights/app-insights.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  it('logs an exception', () => {
    const spy = spyOn(AppInsightsService.prototype, 'logException');

    const errorHandlerService = new ErrorHandlerService(new AppInsightsService());
    const err = new Error('Something bad happened');
    errorHandlerService.handleError(err);

    expect(spy.calls.count()).withContext('spy method was called once').toBe(1);
    expect(spy.calls.first().args).toEqual([err]);
  });
});
