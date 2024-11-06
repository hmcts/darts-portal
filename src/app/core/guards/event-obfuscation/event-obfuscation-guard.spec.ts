import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { eventObfuscationGuard } from './event-obfuscation-guard';

describe('eventObfuscationGuard', () => {
  const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockStateRouter = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => eventObfuscationGuard(...guardParameters));

  const prepareGuard = (isObfuscationEnabled: boolean) => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            isEventObfuscationEnabled: jest.fn().mockReturnValue(isObfuscationEnabled),
          },
        },
      ],
    });
  };

  it('should return true if event obfucation is enabled', () => {
    prepareGuard(true);
    const result = executeGuard(mockRouteSnapshot, mockStateRouter);
    expect(result).toBe(true);
  });

  it('should return false if event obfucation is disabled', () => {
    prepareGuard(false);
    const result = executeGuard(mockRouteSnapshot, mockStateRouter);
    expect(result).toBe(false);
  });

  it('should navigate to page-not-found if event obfuscation is disabled', () => {
    prepareGuard(false);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(navigateSpy).toHaveBeenCalledWith('page-not-found');
  });

  it('should not navigate if event obfuscation is enabled', () => {
    prepareGuard(true);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should call isEventObfuscationEnabled on FeatureFlagService', () => {
    prepareGuard(true);
    const featureFlagService = TestBed.inject(FeatureFlagService);
    const spy = jest.spyOn(featureFlagService, 'isEventObfuscationEnabled');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(spy).toHaveBeenCalled();
  });
});
