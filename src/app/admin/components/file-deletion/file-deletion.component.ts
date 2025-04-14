import { AudioFileMarkedDeletion, TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { UserService } from '@services/user/user.service';
import { map } from 'rxjs';
import { AudioFileResultsComponent } from './audio-file-results/audio-file-results.component';
import { TranscriptsForDeletionComponent } from './transcripts-for-deletion/transcripts-for-deletion.component';

@Component({
  selector: 'app-file-deletion',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    TabsComponent,
    TabDirective,
    AudioFileResultsComponent,
    LoadingComponent,
    GovukBannerComponent,
    CommonModule,
    TranscriptsForDeletionComponent,
  ],
  templateUrl: './file-deletion.component.html',
  styleUrl: './file-deletion.component.scss',
})
export class FileDeletionComponent {
  private readonly activeTabKey = 'file-deletion';

  readonly tabNames = {
    audioFiles: 'Audio files',
    transcripts: 'Transcripts',
  } as const;

  fileDeletionService = inject(FileDeletionService);
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  activeTabService = inject(ActiveTabService);

  approvedForDeletion$ = this.route.queryParams.pipe(map((params) => !!params.approvedForDeletion));
  unmarkedAndUnhidden$ = this.route.queryParams.pipe(map((params) => !!params.unmarkedAndUnhidden));
  fileType$ = this.route.queryParams.pipe(map((params) => params.type));

  audioFiles = toSignal(this.fileDeletionService.getAudioFilesMarkedForDeletion());
  transcripts = toSignal(this.fileDeletionService.getTranscriptionDocumentsMarkedForDeletion());

  audioCount = computed(() => this.audioFiles()?.length);
  transcriptCount = computed(() => this.transcripts()?.length);
  isLoading = computed(() => !(this.audioFiles() && this.transcripts()));
  tab = computed(() => this.activeTabService.activeTabs()[this.activeTabKey] ?? this.tabNames.audioFiles);

  onTabChange(tab: string) {
    this.activeTabService.setActiveTab(this.activeTabKey, tab);
  }

  onDeleteAudio(audio: AudioFileMarkedDeletion) {
    if (this.userService.hasMatchingUserId(audio.hiddenById)) {
      this.router.navigate(['/admin/file-deletion/unauthorised'], { state: { type: 'audio' } });
    } else {
      this.router.navigate(['/admin/file-deletion/audio'], {
        state: { file: { ...audio, startAt: audio.startAt.toISO(), endAt: audio.endAt.toISO() } },
      });
    }
  }

  onDeleteTranscript(transcript: TranscriptionDocumentForDeletion) {
    if (transcript.hiddenById && this.userService.hasMatchingUserId(transcript.hiddenById)) {
      this.router.navigate(['/admin/file-deletion/unauthorised'], { state: { type: 'transcript' } });
    } else {
      this.router.navigate(['/admin/file-deletion/transcript', transcript.transcriptionDocumentId], {
        state: {
          file: { ...transcript, hearingDate: transcript.hearingDate ? transcript.hearingDate.toISO() : undefined },
        },
      });
    }
  }
}
