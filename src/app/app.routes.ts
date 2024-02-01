import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ForbiddenComponent } from '@components/error/forbidden/forbidden.component';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { UserService } from '@services/user/user.service';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PORTAL_ROUTES } from './portal/portal.routes';

// Place all redirects here
const openRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'internal-error', component: InternalErrorComponent },
  { path: 'dev/components', loadComponent: () => import('./components/dev/dev.component').then((c) => c.DevComponent) },
  { path: 'admin', redirectTo: '/admin/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/page-not-found' },
];

const protectedRoutes: Routes = [...PORTAL_ROUTES, ...ADMIN_ROUTES].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
}));

export const APP_ROUTES = [...protectedRoutes, ...openRoutes];
