import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioSamplesComponent } from './audio-samples/audio-samples.component';
import { AudiosComponent } from './audios/audios.component';
import { HomeComponent } from './home/home.component';
import { InboxComponent } from './inbox/inbox.component';
import { TranscriptionsComponent } from './transcriptions/transcriptions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'audios', component: AudiosComponent },
  { path: 'transcriptions', component: TranscriptionsComponent },
  { path: 'audio-sample-poc', component: AudioSamplesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
