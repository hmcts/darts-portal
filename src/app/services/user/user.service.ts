import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@darts-types/user-state';
import { BehaviorSubject, Observable, lastValueFrom, of, shareReplay, switchMap, tap } from 'rxjs';

const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userProfile: UserState | undefined;

  //Used to obtain UserState in services, needs addressing
  public req$ = this.http.get<UserState>(USER_PROFILE_PATH).pipe(shareReplay(1));

  //TO-DO Convert from Promises to Observables and ensure no breaking changes against current consumers
  constructor(private http: HttpClient) {}

  private async loadUserProfile(): Promise<void> {
    this.userProfile = await lastValueFrom(this.http.get<UserState>(USER_PROFILE_PATH));
  }

  async getUserProfile(): Promise<UserState | undefined> {
    if (!this.userProfile) {
      await this.loadUserProfile();
    }
    return this.userProfile;
  }
}
