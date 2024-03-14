import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RoleName, UserState } from '@core-types/index';
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

  public isAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }

  public isSuperUser(): boolean {
    return this.hasRole('SUPER_USER');
  }

  public isRequester(): boolean {
    return this.hasRole('REQUESTER');
  }

  public isTranslationQA(): boolean {
    return this.hasRole('TRANSLATION_QA');
  }

  private hasRole(role: RoleName): boolean {
    return this.userState() ? this.userState()!.roles.some((x) => x.roleName === role) : false;
  }

  public hasRoles(roles: RoleName[]): boolean {
    return this.userState() ? roles.some((role) => this.userState()!.roles.some((x) => x.roleName === role)) : false;
  }
}
