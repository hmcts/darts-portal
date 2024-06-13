import { User } from '@admin-types/index';
import { TranscriptionDocument } from '@admin-types/transcription';
import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';

@Component({
  selector: 'app-transcript-file-advanced-detail',
  standalone: true,
  templateUrl: './transcript-file-advanced-detail.component.html',
  styleUrl: './transcript-file-advanced-detail.component.scss',
  imports: [GovukHeadingComponent, BytesPipe, LuxonDatePipe, DecimalPipe, RouterLink],
})
export class TranscriptFileAdvancedDetailComponent {
  @Input() transcription!: {
    document: TranscriptionDocument;
    details: TranscriptionDetails;
    uploadedByUser: User;
    lastModifiedByUser: User;
  };
}
