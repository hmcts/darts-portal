import { AppInsightsService } from '../app-insights/app-insights.service';
import { AppConfigService } from '../app-config/app-config.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  const fakeAppConfigService = {
    getAppConfig: () => ({
      appInsightsKey: 'KEY',
    }),
  };

  it('logs an exception', () => {
    const spy = jest.spyOn(AppInsightsService.prototype, 'logException');

    const errorHandlerService = new ErrorHandlerService(
      new AppInsightsService(fakeAppConfigService as AppConfigService)
    );
    const err = new Error('Something bad happened');
    errorHandlerService.handleError(err);

    expect(spy).toHaveBeenCalledWith(err);
  });
});
