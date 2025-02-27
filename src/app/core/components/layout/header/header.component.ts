import { CommonModule } from '@angular/common';
import { Component, DoCheck, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { HeaderService } from '@services/header/header.service';
import { UserService } from '@services/user/user.service';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { PortalNavigationComponent } from './portal-navigation/portal-navigation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, AdminNavigationComponent, PortalNavigationComponent],
})
export class HeaderComponent implements DoCheck {
  userService = inject(UserService);
  router = inject(Router);
  isAuthenticated = false;
  isVisible$ = this.headerService.isVisible$;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService
  ) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }

  isAdminNavigation() {
    return (this.userService.isAdmin() || this.userService.isSuperUser()) && this.router.url.startsWith('/admin');
  }
}
