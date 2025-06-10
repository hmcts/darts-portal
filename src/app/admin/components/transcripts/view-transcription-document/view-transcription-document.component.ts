import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { TranscriptionDocument } from '@admin-types/transcription';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpiredBannerComponent } from '@common/expired-banner/expired-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HiddenFileBannerComponent } from '@common/hidden-file-banner/hidden-file-banner.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { HistoryService } from '@services/history/history.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { Observable, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { TranscriptFileAdvancedDetailComponent } from './transcript-file-advanced-detail/transcript-file-advanced-detail.component';
import { TranscriptFileBasicDetailComponent } from './transcript-file-basic-detail/transcript-file-basic-detail.component';

@Component({
  selector: 'app-view-transcription-document',
  standalone: true,
  templateUrl: './view-transcription-document.component.html',
  styleUrl: './view-transcription-document.component.scss',
  imports: [
    GovukHeadingComponent,
    RouterLink,
    AsyncPipe,
    LoadingComponent,
    CommonModule,
    TabsComponent,
    TabDirective,
    TranscriptFileBasicDetailComponent,
    TranscriptFileAdvancedDetailComponent,
    HiddenFileBannerComponent,
    ExpiredBannerComponent,
  ],
})
export class ViewTranscriptionDocumentComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  transcriptionAdminService = inject(TranscriptionAdminService);
  transcriptionService = inject(TranscriptionService);
  userAdminService = inject(UserAdminService);
  userService = inject(UserService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/transcripts';

  transcriptionDocumentId = Number(this.route.snapshot.params.transcriptionDocumentId);

  loading = signal(true);

  transcription$ = this.getTranscriptionDocument();

  private getTranscriptionDocument() {
    return this.transcriptionAdminService
      .getTranscriptionDocument(this.transcriptionDocumentId)
      .pipe(switchMap((document) => this.getUserNames(document)))
      .pipe(
        switchMap((document: TranscriptionDocument) =>
          forkJoin({
            document: of(document),
            details: this.transcriptionService.getTranscriptionDetails(document.transcriptionId),
            fileBanner: this.getHiddenFileBanner(document),
          }).pipe(
            map(({ document, details, fileBanner }) => ({
              document,
              details,
              fileBanner,
            }))
          )
        ),
        finalize(() => this.loading.set(false))
      );
  }

  private getHiddenFileBanner(document: TranscriptionDocument): Observable<HiddenFileBanner | null> {
    return document.adminAction && document.isHidden
      ? this.transcriptionAdminService.getHiddenReason(document.adminAction.reasonId).pipe(
          map(
            (reason): HiddenFileBanner => ({
              id: document.transcriptionId,
              isHidden: document.isHidden,
              isApprovedForManualDeletion: document.adminAction?.isMarkedForManualDeletion ?? false,
              markedForManualDeletionBy: document.adminAction?.markedForManualDeletionBy ?? 'Unknown',
              isMarkedForDeletion: reason?.markedForDeletion ?? false,
              hiddenReason: reason?.displayName ?? 'Unknown',
              hiddenByName: document.adminAction?.hiddenByName ?? 'Unknown',
              ticketReference: document.adminAction?.ticketReference ?? 'Unknown',
              comments: document.adminAction?.comments ?? 'Unknown',
              fileType: 'transcription_document',
            })
          )
        )
      : of(null);
  }

  private getUserNames(document: TranscriptionDocument): Observable<TranscriptionDocument> {
    const userIds = [
      ...new Set([
        document.uploadedBy,
        document.lastModifiedBy,
        document.adminAction && document.adminAction?.hiddenById,
        document.adminAction && document.adminAction?.markedForManualDeletionById,
      ]),
    ] as number[];

    return this.userAdminService.getUsersById(userIds, true).pipe(
      map((users) => {
        const lastModifiedBy = users.find((u) => u.id == document.lastModifiedBy);
        const uploadedBy = users.find((u) => u.id == document.uploadedBy);
        const hiddenByName = users.find((u) => u.id == document.adminAction?.hiddenById)?.fullName;
        const hiddenByIsSystemUser = users.find((u) => u.id == document.adminAction?.hiddenById)?.isSystemUser;
        const markedForManualDeletionBy = users.find(
          (u) => u.id == document.adminAction?.markedForManualDeletionById
        )?.fullName;

        return {
          ...document,
          uploadedByObj: {
            id: uploadedBy?.id,
            fullName: uploadedBy?.fullName,
            isSystemUser: uploadedBy?.isSystemUser,
          },
          lastModifiedByObj: {
            id: lastModifiedBy?.id,
            fullName: lastModifiedBy?.fullName,
            isSystemUser: lastModifiedBy?.isSystemUser,
          },
          adminAction: { ...document.adminAction, hiddenByName, hiddenByIsSystemUser, markedForManualDeletionBy },
        } as TranscriptionDocument;
      })
    );
  }

  hideOrUnhideFile(document: TranscriptionDocument) {
    if (document.isHidden) {
      this.transcriptionAdminService.unhideTranscriptionDocument(this.transcriptionDocumentId).subscribe(() => {
        this.transcription$ = this.getTranscriptionDocument();
      });
    } else {
      this.router.navigate(['admin/file', this.transcriptionDocumentId, 'hide-or-delete'], {
        state: { fileType: 'transcription_document' },
      });
    }
  }
}
