import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
            parseUrl: jest.fn((url: string) => ({ url }) as unknown as UrlTree),
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

  it('should redirect to page-not-found if event obfuscation is disabled', () => {
    prepareGuard(false);
    const router = TestBed.inject(Router);

    const result = executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(router.parseUrl).toHaveBeenCalledWith('/page-not-found');
    expect(result).toEqual({ url: '/page-not-found' });
  });

  it('should not redirect if event obfuscation is enabled', () => {
    prepareGuard(true);
    const router = TestBed.inject(Router);
    const parseUrlSpy = jest.spyOn(router, 'parseUrl');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(parseUrlSpy).not.toHaveBeenCalled();
  });

  it('should call isEventObfuscationEnabled on FeatureFlagService', () => {
    prepareGuard(true);
    const featureFlagService = TestBed.inject(FeatureFlagService);
    const spy = jest.spyOn(featureFlagService, 'isEventObfuscationEnabled');

    executeGuard(mockRouteSnapshot, mockStateRouter);

    expect(spy).toHaveBeenCalled();
  });
});
