import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { UserState } from '@core-types/user/user-state.interface';
import { REFRESH_USER_PROFILE_PATH, USER_PROFILE_PATH, UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUserState: UserState = { userName: 'test@test.com', userId: 1, roles: [], isActive: true };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
        provideRouter([{ path: 'forbidden', component: ForbiddenComponent }]),
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
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
        isActive: true,
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
        isActive: true,
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
            roleName: 'JUDICIARY',
            permissions: [],
          },
        ],
        isActive: true,
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
        isActive: true,
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
      const translationQA: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'TRANSLATION_QA',
            permissions: [],
          },
        ],
        isActive: true,
      };
      service.userState.set(translationQA);
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
        isActive: true,
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
        isActive: true,
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
            globalAccess: true,
            permissions: [],
          },
        ],
        isActive: true,
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

    it('returns false if the user has non-global Super User role', () => {
      const adminUser: UserState = {
        userName: '',
        userId: 1,
        roles: [
          {
            roleId: 123,
            roleName: 'SUPER_USER',
            globalAccess: false,
            permissions: [],
          },
        ],
        isActive: true,
      };
      service.userState.set(adminUser);
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

    it('navigates to forbidden page when user is not active', fakeAsync(() => {
      const routerSpy = jest.spyOn(router, 'navigate');
      service.userState.set({ ...mockUserState, isActive: false });
      service.refreshUserProfile();

      const req = httpMock.expectOne(REFRESH_USER_PROFILE_PATH);
      req.flush({ ...mockUserState, isActive: false });

      tick();

      expect(routerSpy).toHaveBeenCalledWith(['/forbidden']);
    }));

    it('does not navigate to forbidden page when user is active', fakeAsync(() => {
      const routerSpy = jest.spyOn(router, 'navigate');
      service.userState.set({ ...mockUserState, isActive: true });
      service.refreshUserProfile();

      const req = httpMock.expectOne(REFRESH_USER_PROFILE_PATH);
      req.flush({ ...mockUserState, isActive: true });

      tick();

      expect(routerSpy).not.toHaveBeenCalled();
    }));
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
        isActive: true,
      };
      service.userState.set(approver);
      expect(service.hasRoles(['SUPER_USER', 'REQUESTER'])).toBeFalsy();
    });

    it('returns true when user has a role', () => {
      const approver: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'APPROVER' }],
        isActive: true,
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
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', courthouseIds: [courthouseId] }],
      };

      service.userState.set(judge);

      expect(service.hasCourthouse('JUDICIARY', courthouseId)).toBe(true);
    });

    it('should return false if user does not have access to a specific courthouse', () => {
      const courthouseId = 100;
      const judge: UserState = {
        userName: '',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.hasCourthouse('JUDICIARY', courthouseId)).toBe(false);
    });

    it('should return false if user does not have role', () => {
      const courthouseId = 100;
      const judge: UserState = {
        userName: '',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.hasCourthouse('TRANSCRIBER', courthouseId)).toBe(false);
    });
  });

  describe('isCourthouseTranscriber', () => {
    it('should return true if transcriber user has correct courthouse id', () => {
      const courthouseId = 100;

      const transcriber: UserState = {
        userName: '',
        userId: 1,
        roles: [{ roleId: 123, roleName: 'TRANSCRIBER', globalAccess: false, courthouseIds: [courthouseId] }],
        isActive: true,
      };

      service.userState.set(transcriber);

      expect(service.isCourthouseTranscriber(courthouseId)).toBe(true);
    });

    it('should return false if user is neither a transcriber nor a courthouse transcriber', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', globalAccess: false, courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.isCourthouseTranscriber(courthouseId)).toBe(false);
    });
  });

  describe('isCourthouseJudge', () => {
    it('should return true if user is a courthouse judge by courthouse ID', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', globalAccess: false, courthouseIds: [courthouseId] }],
      };

      service.userState.set(judge);

      expect(service.isCourthouseJudge(courthouseId)).toBe(true);
    });

    it('should return true if user is a global judge regardless of courthouse ID', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', globalAccess: true, courthouseIds: [200] }],
      };

      service.userState.set(judge);

      expect(service.isCourthouseJudge(courthouseId)).toBe(true);
    });

    it('should return false if user is neither a global judge nor a courthouse judge', () => {
      const courthouseId = 100;

      const judge: UserState = {
        userName: '',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', globalAccess: false, courthouseIds: [200] }],
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
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', globalAccess: true }],
      };

      service.userState.set(judge);

      expect(service.isGlobalJudge()).toBe(true);
    });

    it('should return false if user is not a global judge', () => {
      const judge: UserState = {
        userName: 'user',
        userId: 1,
        isActive: true,
        roles: [{ roleId: 123, roleName: 'JUDICIARY', globalAccess: false }],
      };

      service.userState.set(judge);
      expect(service.isGlobalJudge()).toBe(false);
    });
  });
});
