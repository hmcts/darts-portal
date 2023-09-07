import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandlerService: ErrorHandler, @Inject('Window') private window: Window) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.log('Unauthorized access error: redirecting to login');
          this.window.location.href = '/login';
        }
        this.errorHandlerService.handleError(error);
        return throwError(() => error);
      })
    );
  }
}
