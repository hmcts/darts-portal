import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NotFoundComponent } from '@common/not-found/not-found.component';
import { UserService } from '@services/user/user.service';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';

const openRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' },
];
const protectedRoutes: Routes = [
  {
    path: 'audios',
    loadComponent: () => import('./components/audios/audios.component').then((c) => c.AudiosComponent),
  },
  {
    path: 'audios/:requestId',
    loadComponent: () =>
      import('./components/audios/audio-view/audio-view.component').then((c) => c.AudioViewComponent),
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
  {
    path: 'case/:caseId/hearing/:hearing_id/request-transcript',
    loadComponent: () =>
      import('./components/hearing/request-transcript/request-transcript.component').then(
        (c) => c.RequestTranscriptComponent
      ),
  },
].map((route) => ({
  ...route,
  canActivate: [authGuard],
  resolve: { userState: () => inject(UserService).userProfile$ },
}));

export const APP_ROUTES = [...protectedRoutes, ...openRoutes];
