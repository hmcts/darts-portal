import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-unauthorised-transcript-deletion',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './unauthorised-transcript-deletion.component.html',
  styleUrl: './unauthorised-transcript-deletion.component.scss',
})
export class UnauthorisedTranscriptDeletionComponent implements OnInit {
  location = inject(Location);
  headerService = inject(HeaderService);

  ngOnInit() {
    this.headerService.hideNavigation();
  }
}
