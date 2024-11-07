import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummaryListRow]',
  standalone: true,
  host: { class: 'govuk-summary-list__row' },
})
export class GovukSummaryListRowDirective {}
