import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { JoinPipe } from '@pipes/join';
import { Hearing } from '@portal-types/index';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { getJudgesAndMagistratesLabel, getJudgesAndMagistratesNames } from '@utils/judges-and-magistrates.utils';

@Component({
  selector: 'app-case-hearings-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, JoinPipe, RouterLink],
  templateUrl: './case-hearings-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './case-hearings-table.component.scss',
})
export class CaseHearingsTableComponent {
  private readonly featureFlagService = inject(FeatureFlagService);
  hearings = input<Hearing[]>([]);
  caseId = input<number>();
  adminScreen = input(false);

  private readonly formattedHearings = computed(() => {
    // This ensures the updated feature flag values will be used when changing to another case.
    // It can be removed when the updated-judge-label flag is removed and the sortNamesAlphabetically function is used instead.
    this.caseId();

    return this.hearings().map((hearing) => ({
      ...hearing,
      judges: getJudgesAndMagistratesNames(this.featureFlagService, hearing.judges) ?? [],
    }));
  });

  // Remove when user portal is updated to use the new judge label format and bind the template to formattedHearings instead.
  get tableHearings(): Hearing[] {
    return this.adminScreen() ? this.formattedHearings() : this.hearings();
  }

  // Remove this when updated-judge-label flag is removed and use the separator directly in the template.
  get judgesAndMagistratesSeparator(): string {
    return this.adminScreen() && this.featureFlagService.isEnabled('updated-judge-label') ? ', ' : ',';
  }

  readonly columns = computed<DatatableColumn[]>(() => {
    // This ensures the updated feature flag values will be used when changing to another case.
    // It can be removed when the updated-judge-label flag is removed and the label uses the constant directly.
    this.caseId();

    return [
      { name: 'Hearing date', prop: 'date', sortable: true },
      {
        name: this.adminScreen() ? getJudgesAndMagistratesLabel(this.featureFlagService, 'Judge') : 'Judge',
        prop: 'judges',
        sortable: true,
      },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'No. of transcripts', prop: 'transcriptCount', sortable: true },
    ];
  });
}
