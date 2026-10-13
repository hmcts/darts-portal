import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
