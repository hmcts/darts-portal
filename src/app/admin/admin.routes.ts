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
    path: 'admin/users/edit/:userId',
    loadComponent: () => import('./components/users/edit-user/edit-user.component').then((c) => c.EditUserComponent),
  },
  {
    path: 'admin/users/:userId/assign-groups',
    loadComponent: () =>
      import('./components/users/user-groups/assign-groups/assign-groups.component').then(
        (c) => c.AssignGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/remove-groups',
    loadComponent: () =>
      import('./components/users/user-groups/remove-groups/remove-groups.component').then(
        (c) => c.RemoveGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/activate',
    loadComponent: () =>
      import('./components/users/activate-user/activate-user.component').then((c) => c.ActivateUserComponent),
  },
  {
    path: 'admin/users/:userId',
    loadComponent: () =>
      import('./components/users/user-record/user-record.component').then((c) => c.UserRecordComponent),
  },
  {
    path: 'admin/groups',
    loadComponent: () => import('./components/groups/groups.component').then((c) => c.GroupsComponent),
  },
  {
    path: 'admin/courthouses',
    loadComponent: () => import('./components/courthouses/courthouses.component').then((c) => c.CourthousesComponent),
  },
  {
    path: 'admin/courthouses/edit/:courthouseId',
    loadComponent: () =>
      import('./components/courthouses/edit-courthouse/edit-courthouse.component').then(
        (c) => c.EditCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/create',
    loadComponent: () =>
      import('./components/courthouses/create-courthouse/create-courthouse.component').then(
        (c) => c.CreateCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/:courthouseId',
    loadComponent: () =>
      import('./components/courthouses/courthouse-record/courthouse-record.component').then(
        (c) => c.CourthouseRecordComponent
      ),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
  data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
}));
