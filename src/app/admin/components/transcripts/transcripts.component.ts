import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { SearchTranscriptsFormComponent } from './search-transcripts-form/search-transcripts-form.component';

@Component({
  selector: 'app-transcripts',
  standalone: true,
  imports: [GovukHeadingComponent, SearchTranscriptsFormComponent],
  templateUrl: './transcripts.component.html',
  styleUrl: './transcripts.component.scss',
})
export class TranscriptsComponent {
  onSearch(values: unknown) {
    console.log(values);
  }
}
