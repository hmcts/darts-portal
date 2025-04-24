import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';

export const IS_AUTH_PATH = '/auth/is-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  private isAuthenticated = false;

  getAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  checkIsAuthenticated(): Observable<boolean> {
    // Timestamp cache busting string eg: /auth/is-authenticated?t=1701426443869
    return this.http.get<boolean>(`${IS_AUTH_PATH}`, { params: { t: new Date().getTime() } }).pipe(
      map((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        return this.isAuthenticated;
      }),
      catchError((error) => {
        // catch 502 and 504 errors and don't update isAuthenticated
        if ([502, 504].includes(error.status)) {
          return of(this.isAuthenticated);
        }
        this.isAuthenticated = false;
        return of(false);
      })
    );
  }
}
