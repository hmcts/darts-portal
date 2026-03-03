import { AdminCase } from '@admin-types/case/case.type';
import { Component, input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';


@Component({
  selector: 'app-case-additional-details',
  imports: [GovukHeadingComponent, GovukSummaryListDirectives, LuxonDatePipe],
  templateUrl: './case-additional-details.component.html',
  styleUrl: './case-additional-details.component.scss',
})
export class CaseAdditionalDetailsComponent {
  caseFile = input<AdminCase>();
}
