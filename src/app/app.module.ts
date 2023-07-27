import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { PhaseBannerComponent } from './components/layout/phase-banner/phase-banner.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ContentComponent } from './components/layout/content/content.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { HomeComponent } from './components/home/home.component';
import { AudiosComponent } from './components/audios/audios.component';
import { TranscriptionsComponent } from './components/transcriptions/transcriptions.component';
import { ErrorHandlerService } from './services/error/error-handler.service';
import { AppConfigService } from './services/app-config/app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';

export function initAppFn(envService: AppConfigService) {
  return () => envService.loadAppConfig();
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
    LoginComponent,
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
    { provide: 'Window', useValue: window },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
