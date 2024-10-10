import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { manualDeletionGuard } from './manual-deletion.guard';

describe('manualDeletionGuard', () => {
  const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockStateRouter = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => manualDeletionGuard(...guardParameters));

  const prepareGuard = (isManualDeletionEnabled: boolean) => {
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
            isManualDeletionEnabled: jest.fn().mockReturnValue(isManualDeletionEnabled),
          },
        },
      ],
    });
  };

  it('should return true if manual deletion is enabled', () => {
    prepareGuard(true);
    const result = executeGuard(mockRouteSnapshot, mockStateRouter);
    expect(result).toBe(true);
  });

  it('should return false if manual deletion is disabled', () => {
    prepareGuard(false);
    const result = executeGuard(mockRouteSnapshot, mockStateRouter);
    expect(result).toBe(false);
  });

  it('should navigate to page-not-found if manual deletion is disabled', () => {
    prepareGuard(false);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(navigateSpy).toHaveBeenCalledWith('page-not-found');
  });

  it('should not navigate if manual deletion is enabled', () => {
    prepareGuard(true);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should call isManualDeletionEnabled on FeatureFlagService', () => {
    prepareGuard(true);
    const featureFlagService = TestBed.inject(FeatureFlagService);
    const spy = jest.spyOn(featureFlagService, 'isManualDeletionEnabled');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(spy).toHaveBeenCalled();
  });
});
