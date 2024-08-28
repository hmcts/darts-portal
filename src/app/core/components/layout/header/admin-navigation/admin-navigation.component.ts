import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navigation.component.html',
  styleUrl: './admin-navigation.component.scss',
})
export class AdminNavigationComponent {
  userService = inject(UserService);
}
