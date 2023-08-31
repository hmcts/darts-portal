import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';

const openRoutes: Routes = [{ path: 'login', component: LoginComponent }];
const protectedRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent) },
  { path: 'inbox', loadComponent: () => import('./components/inbox/inbox.component').then((c) => c.InboxComponent) },
  {
    path: 'audios',
    loadComponent: () => import('./components/audios/audios.component').then((c) => c.AudiosComponent),
  },
  {
    path: 'transcriptions',
    loadComponent: () =>
      import('./components/transcriptions/transcriptions.component').then((c) => c.TranscriptionsComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'case/:caseId',
    loadComponent: () => import('./components/case-file/case-file.component').then((c) => c.CaseFileComponent),
  },
].map((route) => ({ ...route, canActivate: [authGuard] }));

export const APP_ROUTES = [...openRoutes, ...protectedRoutes];
