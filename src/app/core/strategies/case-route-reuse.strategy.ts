import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from '@angular/router';

export class CaseRouteReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const caseRoutes = ['case/:caseId', 'admin/case/:caseId'];

    if (future.routeConfig === curr.routeConfig && caseRoutes.includes(future.routeConfig?.path ?? '')) {
      return future.paramMap.get('caseId') === curr.paramMap.get('caseId');
    }

    return super.shouldReuseRoute(future, curr);
  }
}
