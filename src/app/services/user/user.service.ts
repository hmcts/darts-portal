import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@darts-types/user-state';
import { shareReplay } from 'rxjs';

export const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  userProfile$ = this.http.get<UserState>(USER_PROFILE_PATH).pipe(shareReplay(1));

  public isTranscriber(userState: UserState): boolean {
    return userState.roles.some((x) => x.roleName === 'TRANSCRIBER');
  }
}
