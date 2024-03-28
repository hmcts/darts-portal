import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);

  ngOnInit() {
    this.headerService.hideNavigation();
  }

  ngOnDestroy() {
    this.headerService.showNavigation();
  }
}
