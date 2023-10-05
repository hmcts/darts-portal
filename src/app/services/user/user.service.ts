import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@darts-types/user-state';
import { Observable, of, take } from 'rxjs';

const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userProfile: UserState | undefined;

  constructor(private http: HttpClient) {}

  private loadUserProfile(): Observable<UserState> {
    const ob = this.http.get<UserState>(USER_PROFILE_PATH);
    ob.subscribe({
      next: (userProfile) => (this.userProfile = userProfile),
    });
    return ob;
  }

  getUserProfile(): Observable<UserState> {
    if (this.userProfile) {
      return of(this.userProfile);
    }
    return this.loadUserProfile().pipe(take(1));
  }
}
