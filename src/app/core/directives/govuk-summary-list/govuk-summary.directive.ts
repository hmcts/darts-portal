import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummary]',
  standalone: true,
  host: { class: 'govuk-summary-list' },
})
export class GovukSummaryDirective {}
