import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserState } from '@core-types/user/user-state.interface';
import { USER_PROFILE_PATH, UserService } from './user.service';

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

    service.userProfile$.subscribe((userProfile) => {
      result = userProfile;
    });

    const req = httpMock.expectOne(USER_PROFILE_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockUserState);

    expect(result).toEqual(mockUserState);
  });

  it('should cache user profile data after loading', () => {
    service.userProfile$.subscribe();

    httpMock.expectOne(USER_PROFILE_PATH).flush(mockUserState);

    service.userProfile$.subscribe();

    httpMock.expectNone(USER_PROFILE_PATH);
  });

  describe('#isTranscriber', () => {
    it('returns true if the user has the Transcriber role', () => {
      const transcriber: UserState = {
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
      service.userState.set(transcriber);
      const result = service.isTranscriber();
      expect(result).toEqual(true);
    });
    it("returns false if the user doesn't have the Transcriber role", () => {
      service.userState.set(mockUserState);
      const result = service.isTranscriber();
      expect(result).toEqual(false);
    });
  });

  describe('#isApprover', () => {
    it('returns true if the user has the Approver role', () => {
      const approver: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'APPROVER',
            permissions: [
              {
                permissionId: 1,
                permissionName: 'local dev permissions',
              },
            ],
          },
        ],
      };
      service.userState.set(approver);
      const result = service.isApprover();
      expect(result).toEqual(true);
    });

    it("returns false if the user doesn't have the Approver role", () => {
      service.userState.set(mockUserState);
      const result = service.isApprover();
      expect(result).toEqual(false);
    });
  });

  describe('#isJudge', () => {
    it('returns true if the user has the Judge role', () => {
      const judge: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'JUDGE',
            permissions: [
              {
                permissionId: 1,
                permissionName: 'local dev permissions',
              },
            ],
          },
        ],
      };
      service.userState.set(judge);
      const result = service.isJudge();
      expect(result).toEqual(true);
    });

    it("returns false if the user doesn't have the Judge role", () => {
      service.userState.set(mockUserState);
      const result = service.isJudge();
      expect(result).toEqual(false);
    });
  });

  describe('#isRequester', () => {
    it('returns true if the user has the Requester role', () => {
      const requester: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'REQUESTER',
            permissions: [
              {
                permissionId: 1,
                permissionName: 'local dev permissions',
              },
            ],
          },
        ],
      };
      service.userState.set(requester);
      const result = service.isRequester();
      expect(result).toEqual(true);
    });

    it("returns false if the user doesn't have the Requester role", () => {
      service.userState.set(mockUserState);
      const result = service.isRequester();
      expect(result).toEqual(false);
    });
  });

  describe('#isTranslationQA', () => {
    it('returns true if the user has the Translation QA role', () => {
      const languageShopUser: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'TRANSLATION_QA',
            permissions: [
              {
                permissionId: 1,
                permissionName: 'local dev permissions',
              },
            ],
          },
        ],
      };
      service.userState.set(languageShopUser);
      const result = service.isTranslationQA();
      expect(result).toEqual(true);
    });

    it("returns false if the user doesn't have the Translation QA role", () => {
      service.userState.set(mockUserState);
      const result = service.isTranslationQA();
      expect(result).toEqual(false);
    });
  });
});
