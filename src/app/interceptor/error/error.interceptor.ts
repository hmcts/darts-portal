import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

// import { ErrorHandlerService } from 'src/app/services/error/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject('location') private location: Location
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        next: (event) => event,
        error: (error) => {
          if (error.status === 401) {
            console.log('Unauthorized access: redirecting to login');
            // this.authService.logout();
            this.location.href = '/auth/logout';
          }
        },
      })
    );
  }
}
