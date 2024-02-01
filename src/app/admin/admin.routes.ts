// admin.routes.ts

import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/users',
    loadComponent: () => import('./components/users/users.component').then((c) => c.UsersComponent),
  },
].map((route) => ({ ...route, data: { allowedRoles: ['ADMIN'] } }));
