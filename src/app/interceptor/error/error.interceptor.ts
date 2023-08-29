import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ErrorHandlerService } from 'src/app/services/error/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private ErrorHandlerService: ErrorHandlerService, @Inject('Window') private window: Window) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error) => {
          if (error.status === 401) {
            console.log('Unauthorized access: redirecting to login');
            this.window.location.href = '/auth/logout';
            this.ErrorHandlerService.handleError(error);
          }
        },
      })
    );
  }
}
