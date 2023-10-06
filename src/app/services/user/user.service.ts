import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@darts-types/user-state';
import { Observable, shareReplay, take } from 'rxjs';

export const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userProfile$!: Observable<UserState>;

  //Used to obtain UserState in services, needs addressing
  public req$ = this.http.get<UserState>(USER_PROFILE_PATH).pipe(shareReplay(1));

  //TO-DO Convert from Promises to Observables and ensure no breaking changes against current consumers
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

  public isTranscriber(userState: UserState): boolean {
    return userState.roles.some((x) => x.roleName === 'TRANSCRIBER');
  }
}
