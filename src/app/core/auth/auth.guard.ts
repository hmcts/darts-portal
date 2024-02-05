import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const userService: UserService = inject(UserService);
  const router = inject(Router);
  const isAdminRoute = route.data?.allowedRoles?.includes('ADMIN') && route.url[0].path === 'admin';

  return authService.checkIsAuthenticated().pipe(
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        localStorage.setItem('returnUrl', state.url);
        router.navigateByUrl('login');
        return of(false);
      } else {
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
          localStorage.removeItem('returnUrl');
          router.navigateByUrl(returnUrl);
        }
      }

      return userService.userProfile$.pipe(
        map(() => {
          // if route is not role protected, allow access
          if (!route.data?.allowedRoles) {
            return true;
          }
          // if user has role, allow access
          if (userService.hasRoles(route.data.allowedRoles)) {
            return true;
          } else {
            if (isAdminRoute) {
              // fail role check for admin, redirect to 404 page
              router.navigateByUrl('page-not-found');
              return false;
            }
            // otherwise, redirect to forbidden page
            router.navigateByUrl('forbidden');
            return false;
          }
        })
      );
    })
  );
};
