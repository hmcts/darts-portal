import { inject } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';

import {FeatureFlagService} from '@services/app-config/feature-flag.service';

export const manualDeletionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const featureFlagService = inject(FeatureFlagService);
  const router = inject(Router);

  if (featureFlagService.isManualDeletionEnabled()) {
    return true;
  } else {
    router.navigateByUrl('page-not-found');
    return false;
  }
};
