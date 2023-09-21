import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@darts-types/user-state';
import { lastValueFrom } from 'rxjs';

const USER_PROFILE_PATH = '/user/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userProfile: UserState | undefined;

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
