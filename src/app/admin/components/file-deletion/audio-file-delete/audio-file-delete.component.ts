import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { ApproveRejectFileDeleteComponent } from '../approve-reject-file-delete/approve-reject-file-delete.component';
import { AudioFileResultsComponent } from '../audio-file-results/audio-file-results.component';
import { UnauthorisedDeletionComponent } from '../unauthorised-deletion/unauthorised-deletion.component';

@Component({
  selector: 'app-audio-file-delete',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    ValidationErrorSummaryComponent,
    AudioFileResultsComponent,
    UnauthorisedDeletionComponent,
    ApproveRejectFileDeleteComponent,
  ],
  templateUrl: './audio-file-delete.component.html',
  styleUrl: './audio-file-delete.component.scss',
})
export class AudioFileDeleteComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  headerService = inject(HeaderService);
  fileDeletionService = inject(FileDeletionService);
  transformedMediaService = inject(TransformedMediaService);

  audioFileState = this.router.getCurrentNavigation()?.extras?.state?.file;
  audioFile: AudioFileMarkedDeletion | null = null;

  errorSummary: { fieldId: string; message: string }[] = [];

  ngOnInit(): void {
    if (!this.audioFileState) {
      this.router.navigate(['/admin/file-deletion']);
      return;
    }

    this.audioFile = this.parseAudioFileDates(this.audioFileState);

    if (this.audioFile && this.userService.hasMatchingUserId(this.audioFile.hiddenById)) {
      this.router.navigate(['/admin/file-deletion/unauthorised'], { state: { type: 'audio' } });
    }

    this.headerService.hideNavigation();
  }

  //Required to enable display of dates upon refresh, due to passing through state
  private parseAudioFileDates(audio: typeof this.audioFileState): AudioFileMarkedDeletion {
    return {
      ...audio,
      startAt: DateTime.fromISO(audio.startAt),
      endAt: DateTime.fromISO(audio.endAt),
    };
  }

  confirmAudio(approveDeletion: boolean) {
    if (approveDeletion) {
      if (this.audioFile) {
        this.fileDeletionService.approveAudioFileDeletion(this.audioFile.mediaId).subscribe(() => {
          this.router.navigate(['/admin/file-deletion'], { queryParams: { approvedForDeletion: true, type: 'Audio' } });
        });
      }
    } else {
      if (this.audioFile) {
        this.transformedMediaService.unhideAudioFile(this.audioFile.mediaId).subscribe(() => {
          this.router.navigate(['/admin/file-deletion'], { queryParams: { unmarkedAndUnhidden: true, type: 'Audio' } });
        });
      }
    }
  }

  getErrorSummary(errors: string[]) {
    this.errorSummary = errors.length > 0 ? [{ fieldId: 'deletionApproval', message: errors[0] }] : [];
  }
}
