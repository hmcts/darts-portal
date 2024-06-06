import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { AsyncPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CaseService } from '@services/case/case.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { AssociatedAudioTableComponent } from '../associated-audio-table/associated-audio-table.component';

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
    RouterLink,
    GovukBannerComponent,
    AssociatedAudioTableComponent,
  ],
  templateUrl: './view-transformed-media.component.html',
  styleUrl: './view-transformed-media.component.scss',
})
export class ViewTransformedMediaComponent {
  transformedMediaService = inject(TransformedMediaService);
  caseService = inject(CaseService);
  userService = inject(UserAdminService);
  route = inject(ActivatedRoute);

  transformedMediaId = this.route.snapshot.params.id;
  hasChangedOwner$ = this.route.queryParams.pipe(map((params) => params.ownerChanged));

  $transformedMedia = this.transformedMediaService.getTransformedMediaById(this.transformedMediaId);

  data$ = this.$transformedMedia.pipe(
    switchMap((transformedMedia) => {
      const { $mediaRequest, $case } = this.getCaseAndMediaRequest(transformedMedia);

      return forkJoin({ mediaRequest: $mediaRequest, case: $case }).pipe(
        switchMap(({ mediaRequest, case: c }) => {
          const ownerUserId = mediaRequest.ownerId;
          const requestedByUserId = mediaRequest.requestedById;

          const $users = this.userService.getUsersById([ownerUserId, requestedByUserId]).pipe(
            map((users) => ({
              owner: users.find((u) => u.id === ownerUserId),
              requestedBy: users.find((u) => u.id === requestedByUserId),
            }))
          );

          return forkJoin({ users: $users }).pipe(
            switchMap(({ users }) =>
              this.transformedMediaService.getAssociatedMediaByTransformedMediaId(this.transformedMediaId).pipe(
                map((associatedAudio) => ({
                  transformedMedia,
                  associatedAudio,
                  mediaRequest,
                  case: c,
                  users,
                }))
              )
            )
          );
        })
      );
    })
  );

  private getCaseAndMediaRequest(transformedMedia: TransformedMediaAdmin) {
    const mediaRequestId = transformedMedia.mediaRequest.id;
    const caseId = transformedMedia.case.id;

    const $mediaRequest = this.transformedMediaService.getMediaRequestById(mediaRequestId);
    const $case = this.caseService.getCase(caseId);

    return { $mediaRequest, $case };
  }
}
