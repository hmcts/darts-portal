import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@darts-types/user-state';
import { Observable, shareReplay, take } from 'rxjs';

export const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userProfile$!: Observable<UserState>;

  constructor(private http: HttpClient) {}

  private loadUserProfile(): Observable<UserState> {
    this.userProfile$ = this.http.get<UserState>(USER_PROFILE_PATH).pipe(shareReplay(1));
    return this.userProfile$;
  }

  getUserProfile(): Observable<UserState> {
    if (this.userProfile$) {
      return this.userProfile$;
    }
    return this.loadUserProfile().pipe(take(1));
  }

  public isTranscriber(): boolean {
    if (this.userProfile) {
      return this.userProfile.roles.some((x) => x.roleName === 'TRANSCRIBER');
    }
    return false;
  }
}
