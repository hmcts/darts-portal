import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '@services/auth/auth.service';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink, ReactiveFormsModule, NgClass, ValidationErrorSummaryComponent],
})
export class LoginComponent {
  form = new FormGroup({
    userType: new FormControl('', Validators.required),
  });
  errors = false;

  loginErrors = [
    {
      fieldId: 'user-type',
      message:
        'Select whether you are an employee of HM Courts and Tribunals Service or you work with HM Courts and Tribunals Service.',
    },
  ];

  constructor(
    public authService: AuthService,
    @Inject('Window') private window: Window
  ) {}

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
