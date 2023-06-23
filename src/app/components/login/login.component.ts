import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, public authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    if (await this.authService.checkAuthenticated()) {
      this.router.navigateByUrl('');
    }
  }
}
