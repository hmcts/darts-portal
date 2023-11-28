import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-assign-transcript',
  standalone: true,
  imports: [CommonModule, GovukHeadingComponent],
  templateUrl: './assign-transcript.component.html',
  styleUrl: './assign-transcript.component.scss',
})
export class AssignTranscriptComponent {}
