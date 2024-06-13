import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { AudioFile } from '@admin-types/index';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { CaseService } from '@services/case/case.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserService } from '@services/user/user.service';
import { Observable, forkJoin, map, shareReplay, switchMap } from 'rxjs';
import { HiddenFileBannerComponent } from '../common/hidden-file-banner/hidden-file-banner.component';
import { UserAdminService } from './../../services/user-admin/user-admin.service';
import { AdvancedAudioFileDetailsComponent } from './advanced-audio-file-details/advanced-audio-file-details.component';
import { BasicAudioFileDetailsComponent } from './basic-audio-file-details/basic-audio-file-details.component';

@Component({
  selector: 'app-audio-file',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    TabsComponent,
    TabDirective,
    BasicAudioFileDetailsComponent,
    AdvancedAudioFileDetailsComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    AsyncPipe,
    JsonPipe,
    HiddenFileBannerComponent,
  ],
  templateUrl: './audio-file.component.html',
  styleUrl: './audio-file.component.scss',
})
export class AudioFileComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  UserAdminService = inject(UserAdminService);
  transformedMediaService = inject(TransformedMediaService);
  transcriptionAdminService = inject(TranscriptionAdminService);

  isAdmin = inject(UserService).isAdmin();

  audioFileId = Number(this.route.snapshot.params.id);

  audioFile$ = this.transformedMediaService
    .getMediaById(this.audioFileId)
    .pipe(switchMap((audioFile) => this.getUserNames(audioFile)))
    .pipe(shareReplay(1));

  fileBanner$: Observable<HiddenFileBanner> = this.audioFile$.pipe(
    switchMap((audioFile) =>
      this.transcriptionAdminService.getHiddenReason(audioFile.adminAction.reasonId).pipe(
        map(
          (reason): HiddenFileBanner => ({
            id: audioFile.id,
            isHidden: audioFile.isHidden,
            isMarkedForManualDeletion: audioFile.adminAction.isMarkedForManualDeletion,
            markedForManualDeletionBy: audioFile.adminAction.markedForManualDeletionBy ?? 'Unknown',
            hiddenReason: reason?.displayName ?? 'Unknown',
            ticketReference: audioFile.adminAction.ticketReference,
            comments: audioFile.adminAction.comments,
            fileType: 'audio_file',
          })
        )
      )
    )
  );

  associatedCases$ = this.audioFile$.pipe(switchMap((audioFile) => this.getAssociatedCasesFromAudioFile(audioFile)));

  data$ = forkJoin({
    audioFile: this.audioFile$,
    associatedCases: this.associatedCases$,
    hiddenFileBanner: this.fileBanner$,
  });

  private getAssociatedCasesFromAudioFile(audioFile: AudioFile): Observable<AssociatedCase[]> {
    const caseIds = [...new Set(audioFile.hearings.map((h) => h.caseId))];
    const cases$ = caseIds.map((caseId) => this.caseService.getCase(caseId));
    return forkJoin(cases$).pipe(
      map((cases) => {
        return audioFile.hearings.map((h) => ({
          caseId: h.caseId,
          hearingDate: h.hearingDate,
          defendants: cases.find((c) => c.id == h.caseId)?.defendants,
          judges: cases.find((c) => c.id == h.caseId)?.judges,
        }));
      })
    );
  }

  private getUserNames(audioFile: AudioFile): Observable<AudioFile> {
    const userIds = [
      ...new Set([
        audioFile.createdById,
        audioFile.lastModifiedById,
        audioFile.adminAction.hiddenById,
        audioFile.adminAction.markedForManualDeletionById,
      ]),
    ];
    return this.UserAdminService.getUsersById(userIds).pipe(
      map((users) => {
        const createdBy = users.find((u) => u.id == audioFile.createdById)?.fullName;
        const lastModifiedBy = users.find((u) => u.id == audioFile.lastModifiedById)?.fullName;
        const hiddenBy = users.find((u) => u.id == audioFile.adminAction.hiddenById)?.fullName;
        const markedForManualDeletionBy = users.find(
          (u) => u.id == audioFile.adminAction.markedForManualDeletionById
        )?.fullName;

        return {
          ...audioFile,
          createdBy,
          lastModifiedBy,
          adminAction: { ...audioFile.adminAction, hiddenBy, markedForManualDeletionBy },
        };
      })
    );
  }
}
