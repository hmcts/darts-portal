import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const authService = inject(authService);
  // if user is logged in and has a token then return true so the component can activate and user can navigate to the page
  // return true;
  // otherwise if the token is not set or invalid then navigate to forbidden page
  return router.navigateByUrl('forbidden');
};
