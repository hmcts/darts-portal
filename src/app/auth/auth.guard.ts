import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const userService: UserService = inject(UserService);
  const router = inject(Router);

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
            router.navigateByUrl('forbidden');
            return false;
          }
        })
      );
    })
  );
};
