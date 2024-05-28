import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { Component, inject, signal } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map, switchMap, tap } from 'rxjs';
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
  ],
  templateUrl: './search-transformed-media.component.html',
  styleUrl: './search-transformed-media.component.scss',
})
export class SearchTransformedMediaComponent {
  transformedMediaService = inject(TransformedMediaService);
  userService = inject(UserAdminService);
  errors: ErrorSummaryEntry[] = [];
  isSearchFormSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  results = signal<TransformedMediaAdmin[]>([]);

  onSearch(values: TransformedMediaSearchFormValues) {
    this.transformedMediaService
      .searchTransformedMedia(values)
      .pipe(tap(() => this.isLoading.set(true)))
      .pipe(
        switchMap((media) => {
          // get an array of unique user ids from media ownerUserId and requestedByUserId
          const userIds = this.getUniqueUserIds(media);
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
                requestedByUserName: requestedBy?.fullName,
              },
            };
          })
        )
      )
      .pipe(tap(() => this.isLoading.set(false)))
      .subscribe((results) => {
        this.results.set(results);
        this.isSearchFormSubmitted.set(true);
      });
  }

  private getUniqueUserIds(media: TransformedMediaAdmin[]) {
    return Array.from(new Set(media.map((m) => [m.mediaRequest.ownerUserId, m.mediaRequest.requestedByUserId]).flat()));
  }
}
