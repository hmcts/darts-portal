import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import UserState from 'server/types/classes/userState';

import { UserService } from './user.service';

describe('UserService', () => {
  let httpClientSpy: HttpClient;
  let userService: UserService;
  let getSpy: jest.SpyInstance<unknown>;

  const testData: UserState = { userName: 'test@test.com', userId: 1, roles: [] };

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;
    userService = new UserService(httpClientSpy);
    getSpy = jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(testData));
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('loads user profile', async () => {
    const userProfile = await userService.getUserProfile();
    expect(userProfile).toEqual(testData);
  });

  it('only loads the user profile the first time', async () => {
    await userService.getUserProfile();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    // get the profile again
    await userService.getUserProfile();
    expect(getSpy).toHaveBeenCalledTimes(1);
  });
});
