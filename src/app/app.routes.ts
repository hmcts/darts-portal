import { Routes } from '@angular/router';
import { ForbiddenComponent } from 'src/app/core/components/error/forbidden/forbidden.component';
import { InternalErrorComponent } from 'src/app/core/components/error/internal-server/internal-error.component';
import { NotFoundComponent } from 'src/app/core/components/error/not-found/not-found.component';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { LoginComponent } from './core/components/login/login.component';
import { PORTAL_ROUTES } from './portal/portal.routes';

// Place all redirects here
const openRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'internal-error', component: InternalErrorComponent },
  { path: 'dev/components', loadComponent: () => import('./dev/dev.component').then((c) => c.DevComponent) },
  { path: 'admin', redirectTo: '/admin/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/page-not-found' },
];

const protectedRoutes: Routes = [...PORTAL_ROUTES, ...ADMIN_ROUTES];

export const APP_ROUTES = [...protectedRoutes, ...openRoutes];
