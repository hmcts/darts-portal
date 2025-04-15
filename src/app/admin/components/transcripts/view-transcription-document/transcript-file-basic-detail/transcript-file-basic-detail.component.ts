import { TranscriptionDocument } from '@admin-types/transcription/transcription-document';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { JoinPipe } from '@pipes/join';

@Component({
  selector: 'app-transcript-file-basic-detail',
  standalone: true,
  templateUrl: './transcript-file-basic-detail.component.html',
  styleUrl: './transcript-file-basic-detail.component.scss',
  imports: [GovukHeadingComponent, GovukSummaryListDirectives, RouterLink, LuxonDatePipe, JoinPipe],
})
export class TranscriptFileBasicDetailComponent {
  @Input() transcription!: {
    document: TranscriptionDocument;
    details: TranscriptionDetails;
  };
}
