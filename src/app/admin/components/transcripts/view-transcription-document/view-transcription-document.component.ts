import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { finalize, forkJoin, map, switchMap } from 'rxjs';
import { AssociatedAudioTableComponent } from '../../transformed-media/associated-audio-table/associated-audio-table.component';

@Component({
  selector: 'app-view-transcription-document',
  standalone: true,
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
  ],
  templateUrl: './view-transcription-document.component.html',
  styleUrl: './view-transcription-document.component.scss',
})
export class ViewTranscriptionDocumentComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  transcriptionAdminService = inject(TranscriptionAdminService);
  transcriptionService = inject(TranscriptionService);
  transformedMediaService = inject(TransformedMediaService);
  userAdminService = inject(UserAdminService);

  transcriptionDocumentId = Number(this.route.snapshot.params.transcriptionDocumentId);

  loading = signal(true);

  associatedAudio$ = this.transformedMediaService.getAssociatedMediaByTranscriptionDocumentId(
    this.transcriptionDocumentId
  );

  transcription$ = this.transcriptionAdminService.getTranscriptionDocument(this.transcriptionDocumentId).pipe(
    switchMap((document) =>
      forkJoin({
        details: this.transcriptionService.getTranscriptionDetails(document.transcriptionId),
        uploadedByUser: this.userAdminService.getUser(document.uploadedBy),
      }).pipe(map(({ details, uploadedByUser }) => ({ document, details, uploadedByUser })))
    )
  );

  data$ = forkJoin({ transcription: this.transcription$, associatedAudio: this.associatedAudio$ }).pipe(
    finalize(() => this.loading.set(false))
  );
}
