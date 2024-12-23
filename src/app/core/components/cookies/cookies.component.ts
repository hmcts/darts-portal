import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CookiesService } from '@services/cookies/cookies.service';

@Component({
  selector: 'app-cookies',
  standalone: true,
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
  imports: [ReactiveFormsModule],
})
export class CookiesComponent implements OnInit {
  fb = inject(FormBuilder);
  location = inject(Location);
  cookieService = inject(CookiesService);

  formSubmitted = false;
  cookieForm!: FormGroup;
  cookiePolicy = this.cookieService.getCookiePolicy();

  ngOnInit(): void {
    this.cookieForm = this.fb.group(this.cookiePolicy!);
  }

  submit() {
    this.cookieService.setCookiePolicy(
      this.cookieForm.value.appInsightsCookiesEnabled,
      this.cookieForm.value.dynatraceCookiesEnabled
    );
    this.formSubmitted = true;
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }
}
