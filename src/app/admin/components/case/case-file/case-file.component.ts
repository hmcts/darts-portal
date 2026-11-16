import { AdminCase } from '@admin-types/case/case.type';
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpiredBannerComponent } from '@common/expired-banner/expired-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { JoinPipe } from '@pipes/join';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { getJudgesAndMagistratesLabel, getJudgesAndMagistratesNames } from '@utils/judges-and-magistrates.utils';

@Component({
  selector: 'app-case-file',
  imports: [
    GovukHeadingComponent,
    JoinPipe,
    LuxonDatePipe,
    RouterLink,
    GovukSummaryListDirectives,
    ReportingRestrictionComponent,
    ExpiredBannerComponent,
  ],
  templateUrl: './case-file.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './case-file.component.scss',
})
export class CaseFileComponent {
  private readonly featureFlagService = inject(FeatureFlagService);
  caseFile = input<AdminCase>();

  get judgesAndMagistratesNames(): string[] | undefined {
    return getJudgesAndMagistratesNames(this.featureFlagService, this.caseFile()?.judges);
  }

  get judgesAndMagistratesLabel(): string {
    return getJudgesAndMagistratesLabel(this.featureFlagService, 'Judge(s)');
  }
}
