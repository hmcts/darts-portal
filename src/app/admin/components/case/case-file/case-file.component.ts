import { AdminCase } from '@admin-types/case/case.type';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { DateTimePipe } from '@pipes/dateTime.pipe';
import { JoinPipe } from '@pipes/join';

@Component({
  selector: 'app-case-file',
  imports: [GovukHeadingComponent, JoinPipe, DateTimePipe, RouterLink, GovukSummaryListDirectives],
  templateUrl: './case-file.component.html',
  styleUrl: './case-file.component.scss',
})
export class CaseFileComponent {
  caseFile = input<AdminCase>();
}
