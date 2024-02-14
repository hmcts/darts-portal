import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GovukDetailsComponent } from '@common/govuk-details/govuk-details.component';
import { ReportingRestriction } from '@core-types/index';

@Component({
  selector: 'app-reporting-restriction',
  standalone: true,
  imports: [GovukDetailsComponent, DatePipe],
  templateUrl: './reporting-restriction.component.html',
  styleUrls: ['./reporting-restriction.component.scss'],
})
export class ReportingRestrictionComponent implements OnInit {
  @Input() restrictions?: ReportingRestriction[] = [];
  @Input() hearingId?: number;

  heading = 'There are restrictions against this case';
  footer = 'For full details, check the events for each hearing below.';
  displayRestrictions!: ReportingRestriction[];

  ngOnInit(): void {
    if (this.hearingId) {
      this.displayRestrictions = (this.restrictions || []).filter((r) => r.hearing_id === this.hearingId);
      if (this.displayRestrictions.length) {
        this.heading = 'There are restrictions against this hearing';
        this.footer = 'For full details, check the hearing events.';
      }
    } else {
      this.displayRestrictions = this.restrictions || [];
    }
  }
}
