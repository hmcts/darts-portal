import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PhaseBannerComponent } from './layout/phase-banner/phase-banner.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentComponent } from './layout/content/content.component';
import { InboxComponent } from './inbox/inbox.component';
import { HomeComponent } from './home/home.component';
import { AudiosComponent } from './audios/audios.component';
import { TranscriptionsComponent } from './transcriptions/transcriptions.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { AudioSamplesComponent } from './audio-samples/audio-samples.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PhaseBannerComponent,
    FooterComponent,
    ContentComponent,
    InboxComponent,
    HomeComponent,
    AudiosComponent,
    TranscriptionsComponent,
    SearchComponent,
    AudioSamplesComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, MatIconModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
