import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserState } from '@darts-types/user-state';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const mockRouter = {
    navigateByUrl: jest.fn(),
  };
  const mockRouteSnapshot = {
    data: {
      allowedRoles: ['APPROVER'],
    },
  } as unknown as ActivatedRouteSnapshot;
  const mockStateRouter = {
    url: '',
  } as unknown as RouterStateSnapshot;

  const userState: UserState = { userName: 'test@test.com', userId: 123, roles: [] };
  const userServiceStub = {
    userProfile$: of(userState),
    hasRoles: jest.fn(),
  };

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const prepareGuard = (checkAuthenticated: boolean) => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: UserService,
          useValue: userServiceStub,
        },
        {
          provide: AuthService,
          useValue: { checkAuthenticated: async () => Promise.resolve(checkAuthenticated) },
        },
      ],
    });
  };

  it('should be created', () => {
    prepareGuard(true);
    expect(executeGuard(mockRouteSnapshot, mockStateRouter)).toBeTruthy();
  });

  it('returns true when authenticated', async () => {
    prepareGuard(true);
    expect(executeGuard(mockRouteSnapshot, mockStateRouter)).toBeTruthy();
  });

  it('returns navigates to login when unauthenticated', async () => {
    prepareGuard(false);
    await executeGuard(mockRouteSnapshot, mockStateRouter);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('login');
  });

  it('should return true if user has allowed roles', async () => {
    prepareGuard(true);
    jest.spyOn(userServiceStub, 'hasRoles').mockReturnValue(true);
    const canActivate = await executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(canActivate).toBe(true);
    expect(userServiceStub.hasRoles).toHaveBeenCalledWith(['APPROVER']);
  });

  it('should navigate to login if user does not have allowed roles', async () => {
    prepareGuard(true);
    jest.spyOn(userServiceStub, 'hasRoles').mockReturnValue(false);
    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(userServiceStub.hasRoles).toHaveBeenCalledWith(['APPROVER']);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('login');
  });
});
