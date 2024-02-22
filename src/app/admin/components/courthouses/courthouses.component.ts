import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { CourthouseSearchFormComponent } from './courthouse-search-form/courthouse-search-form.component';

@Component({
  selector: 'app-courthouses',
  standalone: true,
  templateUrl: './courthouses.component.html',
  styleUrl: './courthouses.component.scss',
  imports: [GovukHeadingComponent, CourthouseSearchFormComponent],
})
export class CourthousesComponent {
  search$ = new Subject<CourthouseSearchFormValues | null>();
  loading$ = new Subject<boolean>();
  isSubmitted$ = new BehaviorSubject<boolean>(false);

  onSubmit(values: CourthouseSearchFormValues) {
    this.isSubmitted$.next(true);
    this.search$.next(values); // Trigger the search
  }

  onClear() {
    this.isSubmitted$.next(false);
    this.search$.next(null); // Clear the search
  }
}
