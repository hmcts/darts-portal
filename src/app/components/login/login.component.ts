import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink, ReactiveFormsModule, NgClass],
})
export class LoginComponent {
  form = new FormGroup({
    userType: new FormControl('', Validators.required),
  });
  errors = false;

  constructor(public authService: AuthService, @Inject('Window') private window: Window) {}

  submit() {
    // preliminary code for internal vs external routing

    if (this.form.get('userType')?.value !== '') {
      if (this.form.value['userType'] == 'external') {
        this.errors = false;
        this.window.location.href = '/auth/login';
      } else {
        this.errors = false;
        this.window.location.href = '/auth/internal/login';
      }
    } else {
      this.errors = true;
    }
  }
}
