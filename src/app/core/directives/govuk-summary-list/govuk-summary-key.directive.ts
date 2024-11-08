import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummaryKey]',
  standalone: true,
  host: { class: 'govuk-summary-list__key' },
})
export class GovukSummaryKeyDirective {}
