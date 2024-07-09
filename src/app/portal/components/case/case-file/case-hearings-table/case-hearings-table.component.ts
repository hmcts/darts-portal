import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Hearing } from '@portal-types/index';

@Component({
  selector: 'app-case-hearings-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, GovukHeadingComponent, LuxonDatePipe],
  templateUrl: './case-hearings-table.component.html',
  styleUrl: './case-hearings-table.component.scss',
})
export class CaseHearingsTableComponent {
  hearings = input<Hearing[]>([]);
  caseId = input<number>();

  columns: DatatableColumn[] = [
    { name: 'Hearing date', prop: 'date', sortable: true },
    { name: 'Judge', prop: 'judges', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'No. of transcripts', prop: 'transcriptCount', sortable: true },
  ];
}
