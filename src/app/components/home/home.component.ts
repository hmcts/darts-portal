import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  public redirect() {
    if (localStorage.getItem('redirectUrl') !== null) {
      this.router.navigateByUrl(`${localStorage.getItem('redirectUrl')}`);
      localStorage.removeItem('redirectUrl');
    }
  }

  ngOnInit(): void {
    this.redirect();
  }
}
