import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoleName, UserState } from '@core-types/index';
import { shareReplay, tap } from 'rxjs';

export const USER_PROFILE_PATH = '/user/profile';
export const REFRESH_USER_PROFILE_PATH = '/user/refresh-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  router = inject(Router);

  public readonly userState = signal<UserState | null>(null);

  userProfile$ = this.http
    .get<UserState>(USER_PROFILE_PATH)
    .pipe(shareReplay(1))
    .pipe(tap((x) => this.userState.set(x)));

  public refreshUserProfile(): void {
    if (this.hasUserState()) {
      this.http
        .post<UserState>(REFRESH_USER_PROFILE_PATH, null)
        .subscribe((userState) => !userState.isActive && this.router.navigate(['/forbidden']));
    }
  }

  public isTranscriber(): boolean {
    return this.hasRole('TRANSCRIBER');
  }

  public isApprover(): boolean {
    return this.hasRole('APPROVER');
  }

  public isJudge(): boolean {
    return this.hasRole('JUDICIARY');
  }

  public isAdmin(): boolean {
    return this.hasGlobalRole('SUPER_ADMIN');
  }

  public isSuperUser(): boolean {
    return this.hasGlobalRole('SUPER_USER');
  }

  public isRequester(): boolean {
    return this.hasRole('REQUESTER');
  }

  public isTranslationQA(): boolean {
    return this.hasRole('TRANSLATION_QA');
  }

  public isCourthouseTranscriber(courthouseId?: number): boolean {
    return courthouseId ? this.hasCourthouse('TRANSCRIBER', courthouseId) : false;
  }

  public isGlobalJudge(): boolean {
    return this.hasGlobalRole('JUDICIARY');
  }

  public isCourthouseJudge(courthouseId?: number): boolean {
    if (courthouseId) {
      return this.isGlobalJudge() || this.hasCourthouse('JUDICIARY', courthouseId);
    }
    return this.isGlobalJudge();
  }

  public hasRoles(roles: RoleName[]): boolean {
    return this.userState() ? roles.some((role) => this.userState()!.roles.some((x) => x.roleName === role)) : false;
  }

  public hasCourthouse(role: RoleName, courthouseId: number): boolean {
    return this.userState()
      ? this.userState()!.roles.some((x) => x.roleName === role && x.courthouseIds?.includes(courthouseId))
      : false;
  }

  public hasMatchingUserId(userId: number): boolean {
    return this.userState() ? this.userState()!.userId === userId : false;
  }

  private hasUserState(): boolean {
    return Boolean(this.userState());
  }

  private hasGlobalRole(role: RoleName): boolean {
    return this.userState() ? this.userState()!.roles.some((x) => x.roleName === role && x.globalAccess) : false;
  }

  private hasRole(role: RoleName): boolean {
    return this.userState() ? this.userState()!.roles.some((x) => x.roleName === role) : false;
  }
}
