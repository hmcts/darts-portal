import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { ApproveRejectFileDeleteComponent } from '../approve-reject-file-delete/approve-reject-file-delete.component';
import { TranscriptsForDeletionComponent } from '../transcripts-for-deletion/transcripts-for-deletion.component';

@Component({
  selector: 'app-transcript-file-delete',
  standalone: true,
  imports: [
    ApproveRejectFileDeleteComponent,
    TranscriptsForDeletionComponent,
    GovukHeadingComponent,
    ValidationErrorSummaryComponent,
  ],
  templateUrl: './transcript-file-delete.component.html',
  styleUrl: './transcript-file-delete.component.scss',
})
export class TranscriptFileDeleteComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  headerService = inject(HeaderService);
  fileDeletionService = inject(FileDeletionService);
  transcriptionService = inject(TranscriptionAdminService);

  transcriptFileState = this.router.getCurrentNavigation()?.extras?.state?.file;
  transcriptFile: TranscriptionDocumentForDeletion | null = null;

  errorSummary: { fieldId: string; message: string }[] = [];

  ngOnInit(): void {
    if (!this.transcriptFileState) {
      this.router.navigate(['/admin/file-deletion']);
      return;
    }

    this.transcriptFile = this.parseTranscriptFile(this.transcriptFileState);

    if (
      this.transcriptFile &&
      this.transcriptFile.hiddenById &&
      this.userService.hasMatchingUserId(this.transcriptFile.hiddenById)
    ) {
      this.router.navigate(['/admin/file-deletion/unauthorised'], { state: { type: 'transcript' } });
    }
    this.headerService.hideNavigation();
  }

  confirmTranscript(approveDeletion: boolean) {
    if (approveDeletion) {
      if (this.transcriptFile) {
        this.fileDeletionService
          .approveTranscriptFileDeletion(this.transcriptFile.transcriptionDocumentId)
          .subscribe(() => {
            this.router.navigate(['/admin/file-deletion'], {
              queryParams: { approvedForDeletion: true, type: 'Transcript' },
            });
          });
      }
    } else {
      if (this.transcriptFile) {
        this.transcriptionService
          .unhideTranscriptionDocument(this.transcriptFile.transcriptionDocumentId)
          .subscribe(() => {
            this.router.navigate(['/admin/file-deletion'], {
              queryParams: { unmarkedAndUnhidden: true, type: 'Transcript' },
            });
          });
      }
    }
  }

  //Required to enable display of dates upon refresh, due to passing through state
  private parseTranscriptFile(transcript: typeof this.transcriptFileState): TranscriptionDocumentForDeletion {
    return {
      ...transcript,
      hearingDate: transcript.hearingDate ? DateTime.fromISO(transcript.hearingDate) : undefined,
    };
  }

  getErrorSummary(errors: { fieldId: string; message: string }[]): void {
    this.errorSummary = errors;
  }
}
