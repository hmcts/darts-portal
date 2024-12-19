import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { AudioFile } from '@admin-types/index';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { AssociatedHearing } from '@admin-types/transformed-media/associated-hearing';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { ExpiredBannerComponent } from '@common/expired-banner/expired-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HiddenFileBannerComponent } from '@common/hidden-file-banner/hidden-file-banner.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { AdvancedAudioFileDetailsComponent } from './advanced-audio-file-details/advanced-audio-file-details.component';
import { BasicAudioFileDetailsComponent } from './basic-audio-file-details/basic-audio-file-details.component';

@Component({
  selector: 'app-audio-file',
  standalone: true,
  templateUrl: './audio-file.component.html',
  styleUrl: './audio-file.component.scss',
  imports: [
    GovukHeadingComponent,
    TabsComponent,
    TabDirective,
    BasicAudioFileDetailsComponent,
    AdvancedAudioFileDetailsComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    AsyncPipe,
    HiddenFileBannerComponent,
    RouterLink,
    ExpiredBannerComponent,
  ],
})
export class AudioFileComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  userAdminService = inject(UserAdminService);
  transformedMediaService = inject(TransformedMediaService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  mediaId = +this.router.getCurrentNavigation()?.extras.state?.mediaId;

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin';

  isAdmin = inject(UserService).isAdmin();

  audioFileId = Number(this.route.snapshot.params.id);

  audioFile$ = this.getAudioFile();

  fileBanner$: Observable<HiddenFileBanner | null> = this.getFileBanner();

  associatedCases$ = this.audioFile$.pipe(switchMap((audioFile) => this.getAssociatedCasesFromAudioFile(audioFile)));
  associatedHearings$ = this.audioFile$.pipe(
    switchMap((audioFile) => this.getAssociatedHearingsFromAudioFile(audioFile))
  );

  data$ = forkJoin({
    audioFile: this.audioFile$,
    associatedCases: this.associatedCases$,
    associatedHearings: this.associatedHearings$,
    hiddenFileBanner: this.fileBanner$,
  });

  private getAssociatedCasesFromAudioFile(audioFile: AudioFile): Observable<AssociatedCase[]> {
    return of(
      audioFile.cases.map((c) => ({
        caseId: c.id,
        caseNumber: c.caseNumber ?? 'Unknown',
        courthouse: c.courthouse.displayName ?? 'Unknown',
        source: c.source ?? 'Unknown',
      }))
    );
  }

  private getAssociatedHearingsFromAudioFile(audioFile: AudioFile): Observable<AssociatedHearing[]> {
    return of(
      audioFile.hearings.map((h) => ({
        caseId: h.caseId,
        hearingId: h.id,
        caseNumber: h.caseNumber ?? 'Unknown',
        hearingDate: h.hearingDate,
        courthouse: h.courthouse.displayName ?? 'Unknown',
        courtroom: h.courtroom?.name ?? 'Unknown',
      }))
    );
  }

  private getUsers(audioFile: AudioFile): Observable<AudioFile> {
    const userIds = [
      ...new Set([
        audioFile.createdById,
        audioFile.lastModifiedById,
        audioFile.adminAction?.hiddenById ?? null,
        audioFile.adminAction?.markedForManualDeletionById ?? null,
      ]),
    ] as number[];

    return this.userAdminService.getUsersById(userIds).pipe(
      map((users) => {
        const createdBy = users.find((u) => u.id == audioFile.createdById)?.fullName;
        const lastModifiedBy = users.find((u) => u.id == audioFile.lastModifiedById)?.fullName;
        const hiddenByName = users.find((u) => u.id == audioFile?.adminAction?.hiddenById)?.fullName;
        const markedForManualDeletionBy = users.find(
          (u) => u.id == audioFile?.adminAction?.markedForManualDeletionById
        )?.fullName;

        return {
          ...audioFile,
          createdBy,
          lastModifiedBy,
          adminAction: audioFile.adminAction
            ? { ...audioFile.adminAction, hiddenByName, markedForManualDeletionBy }
            : undefined,
        };
      })
    );
  }

  getHearingIds(
    hearings: {
      id: number;
      hearingDate: DateTime<boolean>;
      caseId: number;
    }[]
  ) {
    return hearings.flatMap((hearing) => hearing.id);
  }

  private getAudioFile(): Observable<AudioFile> {
    return (this.audioFile$ = this.transformedMediaService
      .getMediaById(this.audioFileId)
      .pipe(switchMap((audioFile) => this.getUsers(audioFile)))
      .pipe(shareReplay(1)));
  }

  private getFileBanner(): Observable<HiddenFileBanner | null> {
    return this.audioFile$.pipe(
      switchMap((audioFile) =>
        audioFile.adminAction
          ? this.transcriptionAdminService.getHiddenReason(audioFile.adminAction.reasonId).pipe(
              map(
                (reason): HiddenFileBanner => ({
                  id: audioFile.id,
                  isHidden: audioFile.isHidden,
                  isApprovedForManualDeletion: audioFile.adminAction?.isMarkedForManualDeletion ?? false,
                  markedForManualDeletionBy: audioFile.adminAction?.markedForManualDeletionBy ?? 'Unknown',
                  isMarkedForDeletion: reason?.markedForDeletion ?? false,
                  hiddenReason: reason?.displayName ?? 'Unknown',
                  hiddenByName: audioFile.adminAction?.hiddenByName ?? 'Unknown',
                  ticketReference: audioFile.adminAction?.ticketReference ?? 'Unknown',
                  comments: audioFile.adminAction?.comments ?? 'Unknown',
                  fileType: 'audio_file',
                })
              )
            )
          : of(null)
      )
    );
  }

  hideOrUnhideFile(audioFile: AudioFile) {
    if (audioFile.isHidden) {
      this.transformedMediaService.unhideAudioFile(this.audioFileId).subscribe(() => {
        this.data$ = forkJoin({
          audioFile: this.getAudioFile(),
          associatedCases: this.associatedCases$,
          associatedHearings: this.associatedHearings$,
          hiddenFileBanner: this.getFileBanner(),
        });
      });
    } else {
      this.router.navigate(['admin/file', this.audioFileId, 'hide-or-delete'], {
        state: {
          fileType: 'audio_file',
          hearings: this.getHearingIds(audioFile.hearings),
          dates: { startAt: audioFile.startAt.toISO(), endAt: audioFile.endAt.toISO() },
          mediaId: this.mediaId,
        },
      });
    }
  }

  isAudioFileExpired(audioFile: AudioFile) {
    return audioFile.retainUntil < DateTime.now();
  }
}
