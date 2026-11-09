import { ActivatedRouteSnapshot, Route, convertToParamMap } from '@angular/router';
import { CaseRouteReuseStrategy } from './case-route-reuse.strategy';

describe('CaseRouteReuseStrategy', () => {
  let strategy: CaseRouteReuseStrategy;

  const portalCaseRoute: Route = { path: 'case/:caseId' };
  const adminCaseRoute: Route = { path: 'admin/case/:caseId' };
  const searchRoute: Route = { path: 'search' };

  function createSnapshot(route: Route, caseId?: string): ActivatedRouteSnapshot {
    return {
      routeConfig: route,
      paramMap: convertToParamMap(caseId ? { caseId } : {}),
    } as ActivatedRouteSnapshot;
  }

  beforeEach(() => {
    strategy = new CaseRouteReuseStrategy();
  });

  it('should not reuse Portal Case component when caseId changes', () => {
    const current = createSnapshot(portalCaseRoute, '21');
    const future = createSnapshot(portalCaseRoute, '24');

    expect(strategy.shouldReuseRoute(future, current)).toBe(false);
  });

  it('should reuse Portal Case component when caseId is unchanged', () => {
    const current = createSnapshot(portalCaseRoute, '21');
    const future = createSnapshot(portalCaseRoute, '21');

    expect(strategy.shouldReuseRoute(future, current)).toBe(true);
  });

  it('should not reuse Admin Case component when caseId changes', () => {
    const current = createSnapshot(adminCaseRoute, '21');
    const future = createSnapshot(adminCaseRoute, '24');

    expect(strategy.shouldReuseRoute(future, current)).toBe(false);
  });

  it('should reuse Admin Case component when caseId is unchanged', () => {
    const current = createSnapshot(adminCaseRoute, '21');
    const future = createSnapshot(adminCaseRoute, '21');

    expect(strategy.shouldReuseRoute(future, current)).toBe(true);
  });

  it('should use default Angular behaviour for unrelated routes', () => {
    const current = createSnapshot(searchRoute);
    const future = createSnapshot(searchRoute);

    expect(strategy.shouldReuseRoute(future, current)).toBe(true);
  });

  it('should not reuse components when route configurations differ', () => {
    const current = createSnapshot(portalCaseRoute, '21');
    const future = createSnapshot(adminCaseRoute, '21');

    expect(strategy.shouldReuseRoute(future, current)).toBe(false);
  });
});
