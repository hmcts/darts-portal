import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { DatatableColumn, ErrorSummaryEntry } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { ScrollService } from '@services/scroll/scroll.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { UserService } from '@services/user/user.service';
import { finalize, forkJoin, map, switchMap } from 'rxjs';
import { SearchTransformedMediaFormComponent } from '../search-transformed-media-form/search-transformed-media-form.component';
import {
  TransformedMediaRow,
  TransformedMediaSearchResultsComponent,
} from '../transformed-media-search-results/transformed-media-search-results.component';

@Component({
  selector: 'app-search-transformed-media',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    SearchTransformedMediaFormComponent,
    LoadingComponent,
    ValidationErrorSummaryComponent,
    TransformedMediaSearchResultsComponent,
    CommonModule,
    DeleteComponent,
    DataTableComponent,
    LuxonDatePipe,
    TableRowTemplateDirective,
    RouterLink,
  ],
  templateUrl: './search-transformed-media.component.html',
  styleUrl: './search-transformed-media.component.scss',
})
export class SearchTransformedMediaComponent {
  transformedMediaService = inject(TransformedMediaService);
  courthouseService = inject(CourthouseService);
  router = inject(Router);
  userService = inject(UserAdminService);
  userPermissions = inject(UserService);
  scrollService = inject(ScrollService);
  audioRequestService = inject(AudioRequestService);

  errors = signal<ErrorSummaryEntry[]>([]);
  courthouses$ = this.courthouseService
    .getCourthouses()
    .pipe(map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)));
  isLoading = signal<boolean>(false);
  isDeleting = signal<boolean>(false);

  selectedMedia = signal<TransformedMediaRow[]>([]);

  deleteColumns: DatatableColumn[] = [
    { name: 'Media ID', prop: 'id', sortable: true },
    { name: 'Case ID', prop: 'caseNumber', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Owner', prop: 'owner', sortable: true },
    { name: 'Requested by', prop: 'requestedBy', sortable: true },
    { name: 'Date requested', prop: 'requestedDate', sortable: true },
  ];

  onErrors(errors: ErrorSummaryEntry[]) {
    this.errors.set(errors);
    this.scrollService.scrollTo('app-validation-error-summary');
  }

  onClear() {
    this.errors.set([]);
    this.transformedMediaService.clearSearch();
  }

  onSearch(values: TransformedMediaSearchFormValues) {
    this.isLoading.set(true);
    this.transformedMediaService
      .searchTransformedMedia(values)
      .pipe(
        switchMap((media) => {
          const userIds = this.getUniqueUserIds(media).filter((id) => id !== undefined) as number[];
          return this.userService.getUsersById(userIds).pipe(map((users) => ({ media, users })));
        })
      )
      .pipe(
        map(({ media, users }) =>
          media.map((m) => {
            const owner = users.find((u) => u.id === m.mediaRequest.ownerUserId);
            const requestedBy = users.find((u) => u.id === m.mediaRequest.requestedByUserId);
            return {
              ...m,
              mediaRequest: {
                ...m.mediaRequest,
                ownerUserName: owner?.fullName,
                requestedByName: requestedBy?.fullName,
              },
            };
          })
        )
      )
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((results) => {
        this.transformedMediaService.searchResults.set(results);
        this.transformedMediaService.isSearchFormSubmitted.set(true);
        this.scrollService.scrollTo('#results');
        if (results?.length === 1) {
          // navigate to the transcript document details page
          this.router.navigate(['/admin/transformed-media', results[0].id]);
        }
      });
  }

  private getUniqueUserIds(media: TransformedMediaAdmin[]) {
    return Array.from(new Set(media.map((m) => [m.mediaRequest.ownerUserId, m.mediaRequest.requestedByUserId]).flat()));
  }

  onDelete() {
    if (this.selectedMedia().length > 0) {
      //Arrange selected media descending by media ID
      this.selectedMedia.set(this.selectedMedia().sort((a, b) => b.id - a.id));
      this.isDeleting.set(true);
    }
  }

  onSelectedMediaChange(medias: TransformedMediaRow[]) {
    this.selectedMedia.set(medias);
  }

  onDeleteConfirmed() {
    const selectedMedia = this.selectedMedia();
    if (selectedMedia.length === 0) return;

    this.isDeleting.set(true);
    this.isLoading.set(true);

    const deleteRequests = selectedMedia.map((media) => this.audioRequestService.deleteTransformedMedia(media.id));

    forkJoin(deleteRequests)
      .pipe(
        finalize(() => {
          this.isDeleting.set(false);
          this.isLoading.set(false);
        })
      )
      .subscribe(() => {
        this.selectedMedia.set([]);
        this.onSearch(this.transformedMediaService.searchFormValues());
      });
  }

  onDeleteCancelled() {
    this.isDeleting.set(false);
  }
}
