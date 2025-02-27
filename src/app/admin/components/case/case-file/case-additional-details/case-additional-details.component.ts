import { AdminCase } from '@admin-types/case/case.type';
import { Component, input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { DateTimePipe } from '@pipes/dateTime.pipe';

@Component({
  selector: 'app-case-additional-details',
  imports: [GovukHeadingComponent, GovukSummaryListDirectives, DateTimePipe],
  templateUrl: './case-additional-details.component.html',
  styleUrl: './case-additional-details.component.scss',
})
export class CaseAdditionalDetailsComponent {
  caseFile = input<AdminCase>();
}
