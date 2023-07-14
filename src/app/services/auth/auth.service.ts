import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import moment from 'moment';

const IS_AUTH_PATH = '/auth/is-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = false;

  constructor(private readonly http: HttpClient, private router: Router, @Inject('Window') private window: Window) {}

  getAuthenticated(): boolean {
    return this.authenticated;
  }

  async checkAuthenticated(): Promise<boolean> {
    try {
      // add timestamp to the second to be doubly-sure we are preventing caching
      await lastValueFrom(this.http.get(`${IS_AUTH_PATH}?t=${moment().format('YYYYMMDDHHmmss')}`));
      this.authenticated = true;
    } catch (err) {
      this.authenticated = false;
    }
    return this.authenticated;
  }
}
