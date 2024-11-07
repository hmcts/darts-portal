import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { FeatureFlagService } from '@services/app-config/feature-flag.service';

export const eventObfuscationGuard: CanActivateFn = () => {
  const featureFlagService = inject(FeatureFlagService);
  const router = inject(Router);

  if (featureFlagService.isEventObfuscationEnabled()) {
    return true;
  } else {
    router.navigateByUrl('page-not-found');
    return false;
  }
};
