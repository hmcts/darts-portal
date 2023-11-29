import { CommonModule, NgIf } from '@angular/common';
import { Component, DoCheck, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { AuthService } from '@services/auth/auth.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, CommonModule],
})
export class HeaderComponent implements DoCheck {
  userService = inject(UserService);
  isAuthenticated = false;
  isVisible$ = this.headerService.isVisible$;
  unreadAudioCount$ = this.audioService.unreadAudioCount$;
  transcriptRequestCounts$ = this.transcriptionService.transcriptRequestCounts$;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private audioService: AudioRequestService,
    private transcriptionService: TranscriptionService
  ) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }
}
