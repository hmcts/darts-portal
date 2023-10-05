import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NotFoundComponent } from '@common/not-found/not-found.component';
import { UserService } from '@services/user/user.service';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';

const openRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' },
];
const protectedRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent) },
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
    loadComponent: () => import('./components/case/case.component').then((c) => c.CaseComponent),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id',
    loadComponent: () => import('./components/hearing/hearing.component').then((c) => c.HearingComponent),
  },
].map((route) => ({
  ...route,
  canActivate: [authGuard],
  resolve: { userState: () => inject(UserService).getUserProfile() },
}));

export const APP_ROUTES = [...protectedRoutes, ...openRoutes];
