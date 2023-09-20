import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const mockRouter = {
    navigateByUrl: jest.fn(),
  };
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const prepareGuard = (checkAuthenticated: boolean) => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
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
    expect(executeGuard).toBeTruthy();
  });

  it('returns true when authenticated', async () => {
    prepareGuard(true);
    expect(await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBeTruthy();
  });

  it('returns navigates to login when unauthenticated', async () => {
    prepareGuard(false);
    await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('login');
  });
});
