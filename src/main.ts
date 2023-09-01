import { AppComponent } from './app/components/app.component';
import { withInterceptorsFromDi, provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { ErrorHandlerService } from './app/services/error/error-handler.service';
import { ErrorInterceptor } from './app/interceptor/error/error.interceptor';
import { AppConfigService } from './app/services/app-config/app-config.service';
import { APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';

export function initAppFn(envService: AppConfigService) {
  return () => envService.loadAppConfig();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFn,
      multi: true,
      deps: [AppConfigService],
    },
    { provide: ErrorHandlerService, useClass: ErrorHandlerService, deps: [AppConfigService] },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true, deps: [ErrorHandlerService, 'Window'] },
    { provide: 'Window', useValue: window },
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
