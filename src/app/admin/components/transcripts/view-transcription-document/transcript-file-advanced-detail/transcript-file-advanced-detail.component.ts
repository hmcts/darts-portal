import { TranscriptionDocument } from '@admin-types/transcription';
import { Component, inject, Input, OnInit } from '@angular/core';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';

@Component({
  selector: 'app-transcript-file-advanced-detail',
  standalone: true,
  templateUrl: './transcript-file-advanced-detail.component.html',
  styleUrl: './transcript-file-advanced-detail.component.scss',
  imports: [DetailsTableComponent],
  providers: [BytesPipe],
})
export class TranscriptFileAdvancedDetailComponent implements OnInit {
  bytesPipe = inject(BytesPipe);
  luxonPipe = inject(LuxonDatePipe);

  @Input() transcription!: {
    document: TranscriptionDocument;
    details: TranscriptionDetails;
  };

  dateFormat = "dd MMM yyyy 'at' h:mm:ssa";
  advancedDetails: ReturnType<typeof this.mapAdvancedTranscriptionDetails> | undefined;

  ngOnInit(): void {
    this.advancedDetails = this.mapAdvancedTranscriptionDetails(
      this.transcription.document,
      this.transcription.details
    );
  }

  private mapAdvancedTranscriptionDetails(document: TranscriptionDocument, details: TranscriptionDetails) {
    return {
      'Transcription object ID': details.transcriptionObjectId,
      'Content object ID': document.contentObjectId,
      'Clip ID': document.clipId,
      Checksum: document.checksum,
      'File size': `${this.bytesPipe.transform(document.fileSizeBytes)}MB`,
      'File type': document.fileType,
      Filename: document.fileName,
      'Date uploaded': `${this.luxonPipe.transform(document.uploadedAt, this.dateFormat) ?? ''}`,
      'Uploaded by': [
        {
          href: `/admin/users/${document.uploadedBy}`,
          value: document.uploadedByName,
        },
      ],
      'Last modified by': [
        {
          href: `/admin/users/${document.lastModifiedBy}`,
          value: document.lastModifiedByName,
        },
      ],
      'Date last modified': `${this.luxonPipe.transform(document.lastModifiedAt, this.dateFormat) ?? ''}`,
      'Transcription hidden?': document.isHidden ? 'Yes' : 'No',
      'Hidden by': document.adminAction?.hiddenByName,
      'Date hidden': `${this.luxonPipe.transform(document.adminAction?.hiddenAt, this.dateFormat) ?? ''}`,
      'Retain until': `${this.luxonPipe.transform(document.retainUntil, this.dateFormat) ?? ''}`,
    };
  }
}
