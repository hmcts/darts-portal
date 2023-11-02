import { DatePipe, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ErrorInterceptor } from '@interceptors/error/error.interceptor';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService } from '@services/error/error-handler.service';
import { APP_ROUTES } from './app/app.routes';
import { AppComponent } from './app/components/app.component';

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
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    AppInsightsService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'Window', useValue: window },
    { provide: DatePipe },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
