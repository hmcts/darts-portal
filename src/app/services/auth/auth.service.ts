import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import moment from 'moment';

const IS_AUTH_PATH = '/auth/is-authenticated';
const LOGOUT_PATH = '/auth/logout';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient, private router: Router, @Inject('Window') private window: Window) {}

  async isAuthenticated(): Promise<boolean> {
    try {
      // add timestamp to the second to be doubly-sure we are preventing caching
      await lastValueFrom(this.http.get(`${IS_AUTH_PATH}?t=${moment().format('YYYYMMDDHHmmss')}`));
      return true;
    } catch (err) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await lastValueFrom(this.http.get(LOGOUT_PATH));
      await this.router.navigateByUrl('/login');
      // reload to ensure path does not include anything from when the user was authenticated
      this.window.location.reload();
    } catch (err) {
      console.error('Failed to logout', err);
    }
  }
}
