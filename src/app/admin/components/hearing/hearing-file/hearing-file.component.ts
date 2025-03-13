import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-hearing-file',
  imports: [GovukHeadingComponent, LuxonDatePipe, RouterLink, GovukSummaryListDirectives, JoinPipe],
  templateUrl: './hearing-file.component.html',
  styleUrl: './hearing-file.component.scss',
})
export class HearingFileComponent {
  hearing = input<AdminHearing>();

  getBackUrl(): string {
    return `/admin/case/${this.hearing()?.case.id}/hearing/${this.hearing()?.id}`;
  }
}
