import { AppComponent } from './app/components/app.component';
import { withInterceptorsFromDi, provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { ErrorInterceptor } from '@interceptors/error/error.interceptor';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService } from '@services/error/error-handler.service';

export function initAppFn(envService: AppConfigService) {
  return () => envService.loadAppConfig();
}

bootstrapApplication(AppComponent, {
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFn,
      multi: true,
      deps: [AppConfigService],
    },
    provideRouter(APP_ROUTES),
    AppInsightsService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'Window', useValue: window },
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
