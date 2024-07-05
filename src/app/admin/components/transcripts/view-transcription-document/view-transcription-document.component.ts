import { HiddenFileBanner } from '@admin-types/common/hidden-file-banner';
import { TranscriptionDocument } from '@admin-types/transcription';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HiddenFileBannerComponent } from '@common/hidden-file-banner/hidden-file-banner.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { NotificationBannerComponent } from '@common/notification-banner/notification-banner.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { Observable, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { AssociatedAudioTableComponent } from '../../transformed-media/associated-audio-table/associated-audio-table.component';
import { TranscriptFileAdvancedDetailComponent } from './transcript-file-advanced-detail/transcript-file-advanced-detail.component';
import { TranscriptFileBasicDetailComponent } from './transcript-file-basic-detail/transcript-file-basic-detail.component';

@Component({
  selector: 'app-view-transcription-document',
  standalone: true,
  templateUrl: './view-transcription-document.component.html',
  styleUrl: './view-transcription-document.component.scss',
  imports: [
    AssociatedAudioTableComponent,
    BreadcrumbComponent,
    DataTableComponent,
    GovukHeadingComponent,
    TableRowTemplateDirective,
    BreadcrumbDirective,
    RouterLink,
    BytesPipe,
    LuxonDatePipe,
    JoinPipe,
    AsyncPipe,
    DecimalPipe,
    LoadingComponent,
    CommonModule,
    TabsComponent,
    TabDirective,
    TranscriptFileBasicDetailComponent,
    TranscriptFileAdvancedDetailComponent,
    NotificationBannerComponent,
    HiddenFileBannerComponent,
  ],
})
export class ViewTranscriptionDocumentComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  transcriptionAdminService = inject(TranscriptionAdminService);
  transcriptionService = inject(TranscriptionService);
  userAdminService = inject(UserAdminService);
  userService = inject(UserService);

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
              isMarkedForManualDeletion: document.adminAction?.isMarkedForManualDeletion ?? false,
              markedForManualDeletionBy: document.adminAction?.markedForManualDeletionBy ?? 'Unknown',
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

    return this.userAdminService.getUsersById(userIds).pipe(
      map((users) => {
        const uploadedByName = users.find((u) => u.id == document.uploadedBy)?.fullName;
        const lastModifiedByName = users.find((u) => u.id == document.lastModifiedBy)?.fullName;
        const hiddenByName = users.find((u) => u.id == document.adminAction?.hiddenById)?.fullName;
        const markedForManualDeletionBy = users.find(
          (u) => u.id == document.adminAction?.markedForManualDeletionById
        )?.fullName;

        return {
          ...document,
          uploadedByName,
          lastModifiedByName,
          adminAction: { ...document.adminAction, hiddenByName, markedForManualDeletionBy },
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

  onBack() {
    this.router.navigate(['/admin/transcripts']);
  }
}
