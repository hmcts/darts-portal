import { CommonModule, NgIf } from '@angular/common';
import { Component, DoCheck } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { AuthService } from '@services/auth/auth.service';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, CommonModule],
})
export class HeaderComponent implements DoCheck {
  isAuthenticated = false;
  isVisible$ = this.headerService.isVisible$;
  unreadAudioCount$ = this.audioService.unreadAudioCount$;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private audioService: AudioRequestService
  ) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }
}
