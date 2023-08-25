import { AppComponent } from './app/components/app.component';
import { withInterceptorsFromDi, provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { ErrorHandlerService } from './app/services/error/error-handler.service';
import { ErrorInterceptor} from './app/interceptor/error/error.interceptor';
import { AppConfigService } from './app/services/app-config/app-config.service';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { AppInsightsService } from './app/services/app-insights/app-insights.service';

export function initAppFn(envService: AppConfigService) {
  return () => envService.loadAppConfig();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFn,
      multi: true,
      deps: [AppConfigService],
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService, deps: [AppConfigService] },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true, deps: [Router, ErrorHandler] },
    // { provide: AppInsightsService, useExisting: AppInsightsService, deps: [AppConfigService] },
    { provide: 'Window', useValue: window },
  ],
}).catch((err) => console.error(err));
