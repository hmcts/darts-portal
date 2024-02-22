import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { authGuard } from '../core/auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/users',
    loadComponent: () => import('./components/users/users.component').then((c) => c.UsersComponent),
  },
  {
    path: 'admin/users/create',
    loadComponent: () =>
      import('./components/users/create-user/create-user.component').then((c) => c.CreateUserComponent),
  },
  {
    path: 'admin/users/:userId',
    loadComponent: () =>
      import('./components/users/user-record/user-record.component').then((c) => c.UserRecordComponent),
  },
  {
    path: 'admin/courthouses',
    loadComponent: () => import('./components/courthouses/courthouses.component').then((c) => c.CourthousesComponent),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
  data: { allowedRoles: ['ADMIN'] },
}));
