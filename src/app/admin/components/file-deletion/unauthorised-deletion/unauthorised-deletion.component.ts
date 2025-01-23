import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-unauthorised-deletion',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './unauthorised-deletion.component.html',
  styleUrl: './unauthorised-deletion.component.scss',
})
export class UnauthorisedDeletionComponent implements OnInit {
  title = inject(Title);
  router = inject(Router);
  location = inject(Location);

  type = this.router.getCurrentNavigation()?.extras?.state?.type;

  ngOnInit(): void {
    if (this.type === 'transcript') {
      this.title.setTitle('DARTS Admin Unauthorised Transcription Deletion');
    } else {
      this.title.setTitle('DARTS Admin Unauthorised Audio Deletion');
    }
  }
}
