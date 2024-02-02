import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GovukDetailsComponent } from '@common/govuk-details/govuk-details.component';
import { ReportingRestriction } from '@darts-types/index';

@Component({
  selector: 'app-reporting-restriction',
  standalone: true,
  imports: [GovukDetailsComponent, DatePipe],
  templateUrl: './reporting-restriction.component.html',
  styleUrls: ['./reporting-restriction.component.scss'],
})
export class ReportingRestrictionComponent {
  @Input() heading = 'There are restrictions against this case';
  @Input() reportingRestriction?: string; // TODO: Remove this when fully migrated to multiple reporting_restrictions
  @Input() restrictions?: ReportingRestriction[] = [];
  @Input() caseHasRestrictions = false;
}
