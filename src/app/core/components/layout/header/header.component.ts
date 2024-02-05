import { CommonModule, NgIf } from '@angular/common';
import { Component, DoCheck, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { CountNotificationService } from 'src/app/portal/services/count-notification/count-notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, CommonModule],
})
export class HeaderComponent implements DoCheck {
  userService = inject(UserService);
  countService = inject(CountNotificationService);
  router = inject(Router);
  isAuthenticated = false;
  isVisible$ = this.headerService.isVisible$;
  unreadAudioCount$ = this.countService.unreadAudio$;
  unassignedTranscriptCount$ = this.countService.unassignedTranscripts$;
  assignedTranscriptCount$ = this.countService.assignedTranscripts$;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService
  ) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }
}
