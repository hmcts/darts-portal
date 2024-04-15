import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserState } from '@core-types/user/user-state.interface';
import { REFRESH_USER_PROFILE_PATH, USER_PROFILE_PATH, UserService } from './user.service';

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
            permissions: [],
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

    it('returns false when user state is not set', () => {
      service.userState.set(null);
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
            permissions: [],
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
            permissions: [],
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
            permissions: [],
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
            permissions: [],
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

  describe('#isAdmin', () => {
    it('returns true if the user has the Super Admin role', () => {
      const adminUser: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'SUPER_ADMIN',
            globalAccess: true,
            permissions: [],
          },
        ],
      };
      service.userState.set(adminUser);
      const result = service.isAdmin();
      expect(result).toEqual(true);
    });

    it("returns false if the user doesn't have the Super Admin role", () => {
      service.userState.set(mockUserState);
      const result = service.isAdmin();
      expect(result).toEqual(false);
    });

    it('returns false if the user has non-global Super Admin role', () => {
      const adminUser: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'SUPER_ADMIN',
            globalAccess: false,
            permissions: [],
          },
        ],
      };
      service.userState.set(adminUser);
      const result = service.isAdmin();
      expect(result).toEqual(false);
    });
  });

  describe('#isSuperUser', () => {
    it('returns true if the user has the Super User role', () => {
      const superUser: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'SUPER_USER',
            permissions: [],
          },
        ],
      };
      service.userState.set(superUser);
      const result = service.isSuperUser();
      expect(result).toEqual(true);
    });

    it("returns false if the user doesn't have the Super User role", () => {
      service.userState.set(mockUserState);
      const result = service.isSuperUser();
      expect(result).toEqual(false);
    });
  });

  describe('#refreshUserProfile', () => {
    it('does not refresh when userstate is not set', () => {
      service.userState.set(null);
      service.refreshUserProfile();

      httpMock.expectNone(REFRESH_USER_PROFILE_PATH);
    });

    it('refreshes when userstate is set', () => {
      service.userState.set(mockUserState);
      service.refreshUserProfile();

      httpMock.expectOne(REFRESH_USER_PROFILE_PATH);
    });
  });

  describe('#hasRoles', () => {
    it('returns false when userstate is not set', () => {
      service.userState.set(null);
      expect(service.hasRoles(['SUPER_USER'])).toBeFalsy();
    });

    it('returns false when user does not have any roles', () => {
      const approver: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'APPROVER' }],
      };
      service.userState.set(approver);
      expect(service.hasRoles(['SUPER_USER', 'REQUESTER'])).toBeFalsy();
    });

    it('returns true when user has a role', () => {
      const approver: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'APPROVER' }],
      };
      service.userState.set(approver);
      expect(service.hasRoles(['REQUESTER', 'APPROVER'])).toBeTruthy();
    });
  });

  describe('hasCourthouse', () => {
    it('should return true if user has access to a specific courthouse', () => {
      const courthouseId = 100;
      const judge: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', courthouseIds: [courthouseId] }],
      };

      service.userState.set(judge);

      expect(service.hasCourthouse(courthouseId)).toBe(true);
    });

    it('should return false if user does not have access to a specific courthouse', () => {
      const courthouseId = 100;
      const judge: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.hasCourthouse(courthouseId)).toBe(false);
    });
  });

  describe('isCourthouseJudge', () => {
    it('should return true if user is a courthouse judge by courthouse ID', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', globalAccess: false, courthouseIds: [courthouseId] }],
      };

      service.userState.set(judge);

      expect(service.isCourthouseJudge(courthouseId)).toBe(true);
    });

    it('should return true if user is a global judge regardless of courthouse ID', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', globalAccess: true, courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.isCourthouseJudge(courthouseId)).toBe(true);
    });

    it('should return false if user is neither a global judge nor a courthouse judge', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', globalAccess: false, courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.isCourthouseJudge(courthouseId)).toBe(false);
    });
  });

  describe('isGlobalJudge', () => {
    it('should return true if user is a global judge', () => {
      const judge: UserState = {
        userName: 'user',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', globalAccess: true }],
      };

      service.userState.set(judge);

      expect(service.isGlobalJudge()).toBe(true);
    });

    it('should return false if user is not a global judge', () => {
      const judge: UserState = {
        userName: 'user',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'JUDGE', globalAccess: false }],
      };

      service.userState.set(judge);
      expect(service.isGlobalJudge()).toBe(false);
    });
  });
});
