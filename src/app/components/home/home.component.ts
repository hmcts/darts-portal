import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterLink],
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
