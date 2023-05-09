import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
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
import { ErrorHandlerService } from '../services/error/error-handler.service';
import { AppConfigService } from '../services/app-config/app-config.service';
import { HttpClientModule } from '@angular/common/http';

export function initAppFn(envService: AppConfigService) {
  return () => envService.loadAppConfig('/app/config');
}

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
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, MatIconModule, HttpClientModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFn,
      multi: true,
      deps: [AppConfigService],
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService, deps: [AppConfigService] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
