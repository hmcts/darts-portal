import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { AsyncPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CaseService } from '@services/case/case.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-view-transformed-media',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    DataTableComponent,
    LuxonDatePipe,
    BytesPipe,
    DecimalPipe,
    TableRowTemplateDirective,
    AsyncPipe,
    JsonPipe,
    JoinPipe,
  ],
  templateUrl: './view-transformed-media.component.html',
  styleUrl: './view-transformed-media.component.scss',
})
export class ViewTransformedMediaComponent {
  transformedMediaService = inject(TransformedMediaService);
  caseService = inject(CaseService);
  userService = inject(UserAdminService);

  transformedMediaId = inject(ActivatedRoute).snapshot.params.id;

  $transformedMedia = this.transformedMediaService.getTransformedMediaById(this.transformedMediaId);
  $associatedAudio = this.transformedMediaService.getAssociatedMediaByTransformedMediaId(this.transformedMediaId);

  data$ = forkJoin({ transformedMedia: this.$transformedMedia, associatedAudio: this.$associatedAudio }).pipe(
    switchMap(({ transformedMedia, associatedAudio }) => {
      const { $mediaRequest, $case, $users } = this.getMediaRequestAndCaseAndUsers(transformedMedia);
      return forkJoin({ mediaRequest: $mediaRequest, case: $case, users: $users }).pipe(
        map(({ mediaRequest, case: c, users }) => ({
          transformedMedia,
          associatedAudioRows: this.mapRows(associatedAudio),
          mediaRequest,
          case: c,
          users,
        }))
      );
    })
  );

  associatedAudioColumns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'audioId', sortable: true },
    { name: 'Case ID', prop: 'caseId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Start time', prop: 'startTime', sortable: true },
    { name: 'End time', prop: 'endTime', sortable: true },
    { name: 'Courtoom', prop: 'courtroom', sortable: true },
    { name: 'Channel number', prop: 'channelNumber', sortable: true },
  ];

  private getMediaRequestAndCaseAndUsers(transformedMedia: TransformedMediaAdmin) {
    const mediaRequestId = transformedMedia.mediaRequest.id;
    const caseId = transformedMedia.case.id;
    const ownerUserId = transformedMedia.mediaRequest.ownerUserId;
    const requestedByUserId = transformedMedia.mediaRequest.requestedByUserId;

    const $mediaRequest = this.transformedMediaService.getMediaRequestById(mediaRequestId);
    const $case = this.caseService.getCase(caseId);
    const $users = this.userService.getUsersById([ownerUserId, requestedByUserId]).pipe(
      map((users) => ({
        owner: users.find((u) => u.id === ownerUserId),
        requestedBy: users.find((u) => u.id === requestedByUserId),
      }))
    );
    return { $mediaRequest, $case, $users };
  }

  mapRows(associatedAudio: AssociatedMedia[]) {
    return associatedAudio.map((audio) => ({
      audioId: audio.id,
      caseId: audio.case.id,
      hearingDate: audio.hearing.hearingDate,
      courthouse: audio.courthouse.displayName,
      startTime: audio.startAt,
      endTime: audio.endAt,
      courtroom: audio.courtroom.name,
      channelNumber: audio.channel,
    }));
  }
}
