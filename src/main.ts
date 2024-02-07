import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ErrorInterceptor } from '@interceptors/error/error.interceptor';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AppConfigService } from '@services/app-config/app-config.service';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { ErrorHandlerService } from '@services/error/error-handler.service';
import { Settings } from 'luxon';
import { APP_ROUTES } from './app/app.routes';
import { AppComponent } from './app/core/components/app/app.component';

export function initAppFn(envService: AppConfigService) {
  return () => envService.loadAppConfig();
}

Settings.defaultZone = 'utc';

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
    DatePipe,
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
    LuxonDatePipe,
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
