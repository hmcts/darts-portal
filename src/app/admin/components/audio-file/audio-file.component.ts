import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { AudioFile } from '@admin-types/index';
import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpiredBannerComponent } from '@common/expired-banner/expired-banner.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HiddenFileBannerComponent } from '@common/hidden-file-banner/hidden-file-banner.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { optionalStringToBooleanOrNull } from '@utils/transform.utils';
import { DateTime } from 'luxon';
import { BehaviorSubject, Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
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
    GovukBannerComponent,
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

  unhiddenOrUnmarkedForDeletion = input(null, { transform: optionalStringToBooleanOrNull });

  associatedCases$ = this.audioFile$.pipe(switchMap((audioFile) => this.getAssociatedCasesFromAudioFile(audioFile)));

  private refresh$ = new BehaviorSubject<void>(undefined);

  data$ = this.refresh$.pipe(
    switchMap(() =>
      forkJoin({
        audioFile: this.audioFile$,
        associatedCases: this.associatedCases$,
        hiddenFileBanner: this.fileBanner$,
      })
    )
  );

  private getAssociatedCasesFromAudioFile(audioFile: AudioFile): Observable<AssociatedCase[]> {
    const caseIds = [...new Set(audioFile.hearings.map((h) => h.caseId))];
    const cases$ = caseIds.map((caseId) => this.caseService.getCase(caseId));
    return forkJoin(cases$).pipe(
      map((cases) => {
        return audioFile.hearings.map((h) => ({
          caseId: h.caseId,
          hearingId: h.id,
          caseNumber: cases.find((c) => c.id == h.caseId)?.number ?? 'Unknown',
          hearingDate: h.hearingDate,
          defendants: cases.find((c) => c.id == h.caseId)?.defendants,
          judges: cases.find((c) => c.id == h.caseId)?.judges,
        }));
      })
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
      this.transformedMediaService
        .checkAssociatedAudioExists(
          audioFile.id,
          audioFile.hearings.map((h) => h.id),
          audioFile.startAt.toISO()!,
          audioFile.endAt.toISO()!
        )
        .pipe(
          switchMap((associatedMedia) => {
            if (associatedMedia.exists) {
              return this.router.navigate(
                ['/admin/audio-file', audioFile.id, 'associated-audio', 'unhide-or-unmark-for-deletion'],
                { state: { media: [...associatedMedia.audioFile, ...associatedMedia.media] } }
              );
            }
            return this.transformedMediaService.unhideAudioFile(this.audioFileId);
          })
        )
        .subscribe(() => this.refresh$.next());
    } else {
      this.router.navigate(['admin/file', this.audioFileId, 'hide-or-delete'], {
        state: {
          fileType: 'audio_file',
          hearings: audioFile.hearings.map((h) => h.id),
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
