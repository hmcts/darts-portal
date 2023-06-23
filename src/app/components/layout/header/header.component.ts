import { Component, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements DoCheck {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }

  async logout() {
    await this.authService.logout();
  }
}
