import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.navigateByUrl('forbidden');
};
