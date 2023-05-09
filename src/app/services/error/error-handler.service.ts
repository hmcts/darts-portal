import { ErrorHandler, Injectable } from '@angular/core';
import { AppInsightsService } from '../app-insights/app-insights.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(private appInsightsService: AppInsightsService) {
    super();
  }

  override handleError(error: Error) {
    // Manually log exception
    console.error('Exception', error);
    this.appInsightsService.logException(error);
  }
}
