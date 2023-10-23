import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (await authService.checkAuthenticated()) {
    if (localStorage.getItem('redirectUrl') !== null) {
      router.navigateByUrl(`${localStorage.getItem('redirectUrl')}`);
      localStorage.removeItem('redirectUrl');
    }
    return true;
  }

  if (state.url !== '/') {
    localStorage.setItem('redirectUrl', state.url);
  }
  return router.navigateByUrl('login');
};
