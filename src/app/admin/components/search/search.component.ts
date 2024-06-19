import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { map } from 'rxjs';
import { CourthouseService } from './../../services/courthouses/courthouses.service';
import { SearchFormComponent } from './search-form/search-form.component';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  imports: [GovukHeadingComponent, SearchFormComponent, JsonPipe],
})
export class SearchComponent {
  courthouseService = inject(CourthouseService);

  courthouses$ = this.courthouseService
    .getCourthouses()
    .pipe(map((data) => this.courthouseService.mapCourthouseDataToCourthouses(data)));

  courthouses = toSignal(this.courthouses$, {
    initialValue: [],
  });
}
