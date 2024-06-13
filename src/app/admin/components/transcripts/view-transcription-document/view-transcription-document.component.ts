import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
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
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { AssociatedAudioTableComponent } from '../../transformed-media/associated-audio-table/associated-audio-table.component';
import { HiddenFileBannerComponent } from './hidden-file-banner/hidden-file-banner.component';
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
  transformedMediaService = inject(TransformedMediaService);
  userAdminService = inject(UserAdminService);
  userService = inject(UserService);

  transcriptionDocumentId = Number(this.route.snapshot.params.transcriptionDocumentId);

  loading = signal(true);

  associatedAudio$ = this.transformedMediaService.getAssociatedMediaByTranscriptionDocumentId(
    this.transcriptionDocumentId
  );

  transcription$ = this.transcriptionAdminService.getTranscriptionDocument(this.transcriptionDocumentId).pipe(
    switchMap((document) =>
      forkJoin({
        details: this.transcriptionService.getTranscriptionDetails(document.transcriptionId),
        //REFACTOR - this should be a single call to get all users
        uploadedByUser: this.userAdminService.getUser(document.uploadedBy),
        lastModifiedByUser: this.userAdminService.getUser(document.lastModifiedBy),
        hiddenByUser: document.isHidden ? this.userAdminService.getUser(document.adminAction.hiddenById) : of(null),
        hiddenReason: document.isHidden
          ? this.transcriptionAdminService.getHiddenReason(document.adminAction.reasonId)
          : of(null),
      }).pipe(
        map(({ details, uploadedByUser, lastModifiedByUser, hiddenByUser, hiddenReason }) => ({
          document,
          details,
          uploadedByUser,
          lastModifiedByUser,
          hiddenByUser,
          hiddenReason,
        }))
      )
    )
  );

  data$ = forkJoin({ transcription: this.transcription$, associatedAudio: this.associatedAudio$ }).pipe(
    finalize(() => this.loading.set(false))
  );

  onBack() {
    this.router.navigate(['/admin/transcripts']);
  }
}
