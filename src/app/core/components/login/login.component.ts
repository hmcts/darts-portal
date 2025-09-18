import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { AuthService } from '@services/auth/auth.service';
import { WINDOW } from '@utils/tokens';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass, ValidationErrorSummaryComponent],
})
export class LoginComponent {
  authService = inject(AuthService);
  private window = inject(WINDOW);

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
