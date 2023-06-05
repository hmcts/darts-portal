import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuardGuard } from '../auth-guard.guard';
import { ForbiddenComponent } from '../forbidden/forbidden.component';
import { AudiosComponent } from './audios/audios.component';
import { HomeComponent } from './home/home.component';
import { InboxComponent } from './inbox/inbox.component';
import { TranscriptionsComponent } from './transcriptions/transcriptions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inbox', component: InboxComponent, canActivate: [authGuardGuard] },
  { path: 'audios', component: AudiosComponent },
  { path: 'transcriptions', component: TranscriptionsComponent },
  { path: 'forbidden', component: ForbiddenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
