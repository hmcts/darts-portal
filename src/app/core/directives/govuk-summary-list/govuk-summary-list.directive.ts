import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummaryList]',
  standalone: true,
  host: { class: 'govuk-summary-list two-thirds' },
})
export class GovukSummaryListDirective {}