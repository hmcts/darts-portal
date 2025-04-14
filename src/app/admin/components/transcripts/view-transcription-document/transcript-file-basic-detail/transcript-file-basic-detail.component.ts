import { TranscriptionDocument } from '@admin-types/transcription/transcription-document';
import { Component, inject, Input, OnInit } from '@angular/core';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { MappingService } from '@services/mapping/mapping.service';

@Component({
  selector: 'app-transcript-file-basic-detail',
  standalone: true,
  templateUrl: './transcript-file-basic-detail.component.html',
  styleUrl: './transcript-file-basic-detail.component.scss',
  imports: [DetailsTableComponent],
})
export class TranscriptFileBasicDetailComponent implements OnInit {
  luxonPipe = inject(LuxonDatePipe);
  mappingService = inject(MappingService);

  @Input() transcription!: {
    document: TranscriptionDocument;
    details: TranscriptionDetails;
  };

  basicDetails: ReturnType<typeof this.mapBasicTranscriptionDetails> | undefined;
  requestDetails: ReturnType<typeof this.mapRequestTranscriptionDetails> | undefined;

  ngOnInit(): void {
    this.basicDetails = this.mapBasicTranscriptionDetails(this.transcription.details);
    this.requestDetails = this.mapRequestTranscriptionDetails(this.transcription.details);
  }

  private mapBasicTranscriptionDetails(transcript: TranscriptionDetails) {
    return {
      'Case ID': [{ href: `/admin/case/${transcript.caseId}`, value: transcript.caseNumber }],
      'Hearing date':
        transcript.hearingId != null // intentional use of != to match undefined/null
          ? [
              {
                href: `/case/${transcript.caseId}/hearing/${transcript.hearingId}`,
                value: this.luxonPipe.transform(transcript.hearingDate, 'dd MMM yyyy'),
              },
            ]
          : this.luxonPipe.transform(transcript.hearingDate, 'dd MMM yyyy'),
      Courthouse: transcript.courthouse,
      Courtroom: transcript.courtroom,
      'Defendant(s)': transcript.defendants,
      'Judge(s)': transcript.judges,
    };
  }

  private mapRequestTranscriptionDetails(transcript: TranscriptionDetails) {
    return {
      'Request type': transcript.requestType,
      'Audio for transcript':
        transcript.transcriptionStartTs && transcript.transcriptionEndTs
          ? 'Start time ' +
            this.luxonPipe.transform(transcript.transcriptionStartTs, 'HH:mm:ss') +
            ' - End time ' +
            this.luxonPipe.transform(transcript.transcriptionEndTs, 'HH:mm:ss')
          : '',
      'Requested date': this.luxonPipe.transform(transcript.received, 'dd MMM yyyy'),
      'Approved on': transcript.approved ? this.luxonPipe.transform(transcript.approved, 'dd MMM yyyy') : undefined,
      'Request method': transcript.isManual ? 'Manual' : 'Automatic',
      'Request ID': transcript.transcriptionId,
      Urgency: transcript.urgency.description,
      'Requested by': transcript.from,
      Instructions: transcript.requestorComments,
      'Judge approval': 'Yes',
      'Removed from user transcripts': transcript.isRemovedFromUserTranscripts ? 'Yes' : 'No',
      'Migrated legacy data comments': transcript.legacyComments ? transcript.legacyComments : undefined,
    };
  }
}
