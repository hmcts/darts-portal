import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';

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
          this.logException(
            new Error(`Import module failed but latest and cached versions are the same - ${latestVersion}`)
          );
          this.window.location.href = '/internal-error';
        }
      })
      .catch(this.logException);
  }

  private logException(error: Error) {
    console.error('Exception', error);
    this.injector.get(AppInsightsService).logException(error);
  }

  override handleError(error: Error) {
    const importFailedMessage = /Failed to fetch dynamically imported module/;
    if (importFailedMessage.test(error.message)) {
      this.handleImportModuleFailed();
    } else {
      this.logException(error);
    }
  }
}
