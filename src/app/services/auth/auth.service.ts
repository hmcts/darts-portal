import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

const IS_AUTH_PATH = '/auth/is-authenticated';
const LOGOUT_PATH = '/auth/logout';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient, private router: Router) {}

  async isAuthenticated(): Promise<boolean> {
    try {
      await lastValueFrom(this.http.get(IS_AUTH_PATH));
      return true;
    } catch (err) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await lastValueFrom(this.http.get(LOGOUT_PATH));
      this.router.navigateByUrl('/login');
    } catch (err) {
      console.error('Failed to logout', err);
    }
  }
}
