import { TranscriptionSearchFormValues } from '@admin-types/transcription';
import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { SearchTransformedMediaFormComponent } from '../search-transformed-media-form/search-transformed-media-form.component';

@Component({
  selector: 'app-search-transformed-media',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    SearchTransformedMediaFormComponent,
    LoadingComponent,
    ValidationErrorSummaryComponent,
  ],
  templateUrl: './search-transformed-media.component.html',
  styleUrl: './search-transformed-media.component.scss',
})
export class SearchTransformedMediaComponent {
  errors: ErrorSummaryEntry[] = [];

  onSearch(values: TranscriptionSearchFormValues) {
    console.log(values);
  }
}
