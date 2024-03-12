import { CommonModule, NgIf } from '@angular/common';
import { Component, DoCheck, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { HeaderService } from '@services/header/header.service';
import { UserService } from '@services/user/user.service';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { PortalNavigationComponent } from './portal-navigation/portal-navigation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, CommonModule, AdminNavigationComponent, PortalNavigationComponent],
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

  isAdminNavigation() {
    return this.userService.isAdmin() && this.router.url.startsWith('/admin');
  }
}
