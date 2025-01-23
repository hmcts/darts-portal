import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummaryList]',
  standalone: true,
  host: { class: 'govuk-summary-list' },
})
export class GovukSummaryListDirective {}
