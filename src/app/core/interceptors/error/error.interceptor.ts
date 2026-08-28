import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorMessageService } from '@services/error/error-message.service';
import { normalizeProblemDetailsError } from '@utils/problem-detail.utils';
import { WINDOW } from '@utils/tokens';
import { Observable, catchError, mergeMap, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorHandlerService = inject(ErrorHandler);
  private errorMessageService = inject(ErrorMessageService);
  private window = inject(WINDOW);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) =>
        normalizeProblemDetailsError(error).pipe(
          mergeMap((normalizedError) => {
            this.handleHttpError(normalizedError);
            return throwError(() => normalizedError);
          })
        )
      )
    );
  }

  private handleHttpError(error: unknown) {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      console.log('Unauthorized access error: redirecting to login');
      this.window.location.href = '/login';
    } else if (error instanceof HttpErrorResponse) {
      this.errorMessageService.handleErrorMessage(error);
    }
    this.errorHandlerService.handleError(error);
  }
}
