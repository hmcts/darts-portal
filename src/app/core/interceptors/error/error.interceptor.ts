import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { ErrorMessageService } from '@services/error/error-message.service';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorHandlerService: ErrorHandler,
    private errorMessageService: ErrorMessageService,
    @Inject('Window') private window: Window
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.log('Unauthorized access error: redirecting to login');
          this.window.location.href = '/login';
        }
        this.errorMessageService.handleErrorMessage(error);
        this.errorHandlerService.handleError(error);
        return throwError(() => error);
      })
    );
  }
}
