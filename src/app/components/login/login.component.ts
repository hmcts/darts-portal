import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink, ReactiveFormsModule, NgClass],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    userType: new FormControl('', Validators.required),
  });
  errors = false;

  constructor(private router: Router, public authService: AuthService, @Inject('Window') private window: Window) {}

  submit() {
    // preliminary code for internal vs external routing
    // if (this.form.value['userType'] == 'external') {
    if (this.form.get('userType')?.value === '') {
      this.errors = true;
    } else {
      this.errors = false;
      this.window.location.href = '/auth/login';
    }
    // }
  }

  async ngOnInit(): Promise<void> {
    // if (await this.authService.checkAuthenticated()) {
    //   this.router.navigateByUrl('');
    // }
  }
}
