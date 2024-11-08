import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummaryValue]',
  standalone: true,
  host: { class: 'govuk-summary-list__value' },
})
export class GovukSummaryValueDirective {}
