import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { Media } from '@admin-types/file-deletion/media.type';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { forkJoin } from 'rxjs';
import { ApproveRejectFileDeleteComponent } from '../approve-reject-file-delete/approve-reject-file-delete.component';
import { AudioFileResultsComponent } from '../audio-file-results/audio-file-results.component';

@Component({
  selector: 'app-audio-file-delete',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    ValidationErrorSummaryComponent,
    AudioFileResultsComponent,
    ApproveRejectFileDeleteComponent,
    RouterLink,
    GovukSummaryListDirectives,
    LuxonDatePipe,
    JoinPipe,
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
  medias: Media[] = [];

  errorSummary: { fieldId: string; message: string }[] = [];

  ngOnInit(): void {
    if (!this.audioFileState) {
      this.router.navigate(['/admin/file-deletion']);
      return;
    }

    this.audioFile = this.parseAudioFileDates(this.audioFileState);
    this.medias = this.audioFile?.media || [];

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
      const mediaIds = this.getMediaIds();

      if (this.audioFile && mediaIds.length > 0) {
        forkJoin(mediaIds.map((mediaId) => this.fileDeletionService.approveAudioFileDeletion(mediaId))).subscribe({
          next: () => {
            this.router.navigate(['/admin/file-deletion'], {
              queryParams: { approvedForDeletion: true, type: 'Audio' },
            });
          },
        });
      }
    } else {
      if (this.audioFile) {
        const associatedMedia = this.mapToAssociatedMedia(this.audioFile);
        const firstId = associatedMedia[0]?.id;

        this.router.navigate(['/admin/audio-file', firstId, 'associated-audio', 'unhide-or-unmark-for-deletion'], {
          state: { media: associatedMedia },
          queryParams: { backUrl: '/admin/file-deletion' },
        });
      }
    }
  }

  getMediaIds(): number[] {
    return this.medias.map((media) => media.id);
  }

  getErrorSummary(errors: { fieldId: string; message: string }[]): void {
    this.errorSummary = errors;
  }

  private mapToAssociatedMedia(audioFile: AudioFileMarkedDeletion): Partial<AssociatedMedia[]> {
    if (!audioFile.media) {
      return [];
    }

    return audioFile.media.map(
      (media) =>
        ({
          id: media.id,
          channel: media.channel,
          startAt: audioFile.startAt,
          endAt: audioFile.endAt,
          courthouseName: audioFile.courthouse,
          courtroomName: audioFile.courtroom,
          isCurrent: media.isCurrent,
          isHidden: true,
        }) as AssociatedMedia
    );
  }
}
