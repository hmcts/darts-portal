import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';

import { switchMap } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const userService: UserService = inject(UserService);
  const router = inject(Router);

  return authService.checkIsAuthenticated().pipe(
    switchMap((isAuthenticated) =>
      userService.userProfile$.pipe(
        map(() => {
          if (!isAuthenticated) {
            return false;
          }
          // if not role protected, allow access
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
      )
    )
  );
};
