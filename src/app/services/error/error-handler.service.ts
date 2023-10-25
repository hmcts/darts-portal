import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppInsightsService } from '@services/app-insights/app-insights.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(
    private injector: Injector,
    private router: Router
  ) {
    super();
  }

  override handleError(error: Error) {
    const appInsightsService = this.injector.get(AppInsightsService);
    console.error('Exception', error);
    appInsightsService.logException(error);
    this.statusChecker(error as HttpErrorResponse);
  }

  private statusChecker(error: HttpErrorResponse) {
    const status = error.status;
    switch (status) {
      case 500: {
        this.router.navigateByUrl('internal-error');
        break;
      }
    }
  }
}
