import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    userType: new FormControl('', Validators.required),
  });

  constructor(private router: Router, public authService: AuthService, @Inject('Window') private window: Window) {}

  submit() {
    // preliminary code for internal vs external routing
    // if (this.form.value['userType'] == 'external') {
    this.window.location.href = '/auth/login';
    // }
  }

  async ngOnInit(): Promise<void> {
    if (await this.authService.isAuthenticated()) {
      this.router.navigateByUrl('');
    }
  }
}
