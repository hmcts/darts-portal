import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AudiosComponent } from './components/audios/audios.component';
import { HomeComponent } from './components/home/home.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { LoginComponent } from './components/login/login.component';
import { TranscriptionsComponent } from './components/transcriptions/transcriptions.component';
import { SearchComponent } from "./components/search/search.component";

const openRoutes: Routes = [{ path: 'login', component: LoginComponent }];
const protectedRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'audios', component: AudiosComponent },
  { path: 'transcriptions', component: TranscriptionsComponent },
  { path: 'search', component: SearchComponent}
].map((route) => ({ ...route, canActivate: [authGuard] }));

@NgModule({
  imports: [RouterModule.forRoot([...openRoutes, ...protectedRoutes])],
  exports: [RouterModule],
})
export class AppRoutingModule {}
