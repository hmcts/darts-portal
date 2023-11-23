import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RoleName, UserState } from '@darts-types/user-state';
import { shareReplay, tap } from 'rxjs';

export const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public readonly userState = signal<UserState | null>(null);

  userProfile$ = this.http
    .get<UserState>(USER_PROFILE_PATH)
    .pipe(shareReplay(1))
    .pipe(tap((x) => this.userState.set(x)));

  public isTranscriber(): boolean {
    return this.hasRole('TRANSCRIBER');
  }

  public isApprover(): boolean {
    return this.hasRole('APPROVER');
  }

  public isJudge(): boolean {
    return this.hasRole('JUDGE');
  }

  public isRequester(): boolean {
    return this.hasRole('REQUESTER');
  }

  public isLanguageShopUser(): boolean {
    return this.hasRole('LANGUAGE_SHOP_USER');
  }

  private hasRole(role: RoleName): boolean {
    return this.userState() ? this.userState()!.roles.some((x) => x.roleName === role) : false;
  }
}
