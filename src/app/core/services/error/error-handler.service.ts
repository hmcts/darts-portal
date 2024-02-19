import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AppInsightsService } from 'src/app/core/services/app-insights/app-insights.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  override handleError(error: Error) {
    const appInsightsService = this.injector.get(AppInsightsService);
    console.error('Exception', error);
    appInsightsService.logException(error);
  }
}
