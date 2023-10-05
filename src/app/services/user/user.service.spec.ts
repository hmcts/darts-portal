import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, USER_PROFILE_PATH } from './user.service';
import { UserState } from '@darts-types/user-state';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUserState: UserState = { userName: 'test@test.com', userId: 1, roles: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user profile data from the API via HTTP', () => {
    let result!: UserState;

    service.getUserProfile().subscribe((userProfile) => {
      result = userProfile;
    });

    const req = httpMock.expectOne(USER_PROFILE_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockUserState);

    expect(result).toEqual(mockUserState);
  });

  it('should cache user profile data after loading', () => {
    service.getUserProfile().subscribe();

    httpMock.expectOne(USER_PROFILE_PATH).flush(mockUserState);

    service.getUserProfile().subscribe();

    httpMock.expectNone(USER_PROFILE_PATH);
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
