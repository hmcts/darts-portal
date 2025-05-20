import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';

export const IMPORT_FAILED_MESSAGE = /Failed to fetch dynamically imported module/;
export const IGNORE_HTTP_STATUS_CODES = [401, 422];

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(
    private readonly injector: Injector,
    @Inject('Window') private readonly window: Window
  ) {
    super();
  }

  private handleImportModuleFailed() {
    const appConfigService = this.injector.get(AppConfigService);
    const cachedVersion = appConfigService.getAppConfig()?.version;
    appConfigService
      .loadAppConfig()
      .then(() => {
        const latestVersion = appConfigService.getAppConfig()?.version;
        if (cachedVersion !== latestVersion) {
          this.injector.get(AppInsightsService).logTrace('Import module failed, page reloaded.');
          this.window.location.reload();
        } else {
          this.handleException(
            new Error(`Import module failed but latest and cached versions are the same - ${latestVersion}`)
          );
          this.window.location.href = '/internal-error';
        }
      })
      .catch(this.handleException);
  }

  private isHttpErrorResponse(error: Error | HttpErrorResponse): error is HttpErrorResponse {
    return error instanceof HttpErrorResponse;
  }

  private isIgnoredHttpStatusCode(error: Error | HttpErrorResponse): boolean {
    return this.isHttpErrorResponse(error) && IGNORE_HTTP_STATUS_CODES.includes(error?.status);
  }

  // See https://angular.dev/guide/http/making-requests#handling-request-failure
  private isNetworkError(error: Error | HttpErrorResponse): boolean {
    return this.isHttpErrorResponse(error) && error?.status === 0 && error?.error instanceof ProgressEvent;
  }

  private handleException(error: Error | HttpErrorResponse) {
    const isIgnoredErrorCode = this.isIgnoredHttpStatusCode(error);
    const isNetworkError = this.isNetworkError(error);
    if (isIgnoredErrorCode || isNetworkError) {
      // log as trace, not exception
      console.log('Exception', error.message);
      this.injector.get(AppInsightsService).logTrace(error.message);
    } else {
      console.error('Exception', error);
      this.injector.get(AppInsightsService).logException(error);
    }
  }

  override handleError(error: Error | HttpErrorResponse) {
    if (IMPORT_FAILED_MESSAGE.test(error.message)) {
      this.handleImportModuleFailed();
    } else {
      this.handleException(error);
    }
  }
}
