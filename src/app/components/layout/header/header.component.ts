import { Component, DoCheck } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '@services/auth/auth.service';
import { HeaderService } from '@services/header/header.service';
import { AudioService } from '@services/audio/audio.service';

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
  unreadCount$ = this.audioService.unreadCount$;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private audioService: AudioService
  ) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }
}
