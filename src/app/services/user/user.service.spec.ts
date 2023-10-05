import { HttpClient } from '@angular/common/http';
import { UserState } from '@darts-types/user-state';
import { of } from 'rxjs';

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

  describe('#isTranscriber', () => {
    it('returns true if the user has the Transcriber role', () => {
      const testData1: UserState = {
        userName: 'test@test.com',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'TRANSCRIBER',
            permissions: [
              {
                permissionId: 1,
                permissionName: 'local dev permissions',
              },
            ],
          },
        ],
      };
      userService.userProfile = testData1;
      const result = userService.isTranscriber();
      expect(result).toEqual(true);
    });
    it("returns false if the user doesn't have the Transcriber role", () => {
      const result = userService.isTranscriber();
      expect(result).toEqual(false);
    });
    it("returns false if the userProfile hasn't been set", () => {
      userService.userProfile = undefined;
      const result = userService.isTranscriber();
      expect(result).toBe(false);
    });
  });
});
