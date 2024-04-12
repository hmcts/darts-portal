import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';

@Component({
  selector: 'app-transcripts',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './transcripts.component.html',
  styleUrl: './transcripts.component.scss',
})
export class TranscriptsComponent {}
