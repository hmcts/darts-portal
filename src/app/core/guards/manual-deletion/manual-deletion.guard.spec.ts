import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
            parseUrl: jest.fn((url: string) => ({ url }) as unknown as UrlTree),
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

  it('should redirect to page-not-found if manual deletion is disabled', () => {
    prepareGuard(false);
    const router = TestBed.inject(Router);

    const result = executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(router.parseUrl).toHaveBeenCalledWith('/page-not-found');
    expect(result).toEqual({ url: '/page-not-found' });
  });

  it('should not redirect if manual deletion is enabled', () => {
    prepareGuard(true);
    const router = TestBed.inject(Router);
    const parseUrlSpy = jest.spyOn(router, 'parseUrl');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(parseUrlSpy).not.toHaveBeenCalled();
  });

  it('should call isManualDeletionEnabled on FeatureFlagService', () => {
    prepareGuard(true);
    const featureFlagService = TestBed.inject(FeatureFlagService);
    const spy = jest.spyOn(featureFlagService, 'isManualDeletionEnabled');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(spy).toHaveBeenCalled();
  });
});
