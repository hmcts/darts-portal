import { Location } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-expired-case',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './expired-case.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './expired-case.component.scss',
})
export class ExpiredCaseComponent implements OnInit {
  location = inject(Location);
  headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
}
