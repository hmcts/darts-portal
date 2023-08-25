import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {Router} from '@angular/router';
// import { ErrorHandlerService } from 'src/app/services/error/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}
//@Inject('Window') private window: Window
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            if(event.status == 401) {
              console.log('Unauthorized access: redirecting to login')
              // this.window.location.href = '/auth/logout';
              this.router.navigateByUrl('login');
            }
          }
          return event;
        },
        error: (error) => {
          if(error.status === 401) {
            console.log('Unauthorized access: redirecting to login')
            // this.window.location.href = '/auth/logout';
            this.router.navigateByUrl('login');
            // this.errorHandlerService.handleError(error);
          }
          else if(error.status === 404) {
            console.log('Page Not Found!')
          }
        }
      }));
  }
}

