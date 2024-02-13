import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { authGuard } from '../core/auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/users',
    loadComponent: () => import('./components/users/users.component').then((c) => c.UsersComponent),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
  data: { allowedRoles: ['ADMIN'] },
}));
