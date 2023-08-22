import { Component, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive],
})
export class HeaderComponent implements DoCheck {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngDoCheck() {
    this.isAuthenticated = this.authService.getAuthenticated();
  }
}
