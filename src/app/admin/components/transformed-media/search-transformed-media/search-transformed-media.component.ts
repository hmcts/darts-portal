import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { finalize, map, switchMap } from 'rxjs';
import { SearchTransformedMediaFormComponent } from '../search-transformed-media-form/search-transformed-media-form.component';
import { TransformedMediaSearchResultsComponent } from '../transformed-media-search-results/transformed-media-search-results.component';

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
  ],
  templateUrl: './search-transformed-media.component.html',
  styleUrl: './search-transformed-media.component.scss',
})
export class SearchTransformedMediaComponent {
  transformedMediaService = inject(TransformedMediaService);
  courthouseService = inject(CourthouseService);
  router = inject(Router);
  userService = inject(UserAdminService);

  errors: ErrorSummaryEntry[] = [];
  courthouses$ = this.courthouseService.getCourthouses();
  isLoading = signal<boolean>(false);

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

        if (results?.length === 1) {
          // navigate to the transcript document details page
          this.router.navigate(['/admin/transformed-media', results[0].id]);
        }
      });
  }

  private getUniqueUserIds(media: TransformedMediaAdmin[]) {
    return Array.from(new Set(media.map((m) => [m.mediaRequest.ownerUserId, m.mediaRequest.requestedByUserId]).flat()));
  }
}
