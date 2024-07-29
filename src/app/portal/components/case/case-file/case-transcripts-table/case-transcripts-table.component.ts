import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptsRow } from '@portal-types/index';

@Component({
  selector: 'app-case-transcripts-table',
  standalone: true,
  imports: [
    DataTableComponent,
    TableRowTemplateDirective,
    RouterLink,
    GovukHeadingComponent,
    LuxonDatePipe,
    NgClass,
    GovukTagComponent,
  ],
  templateUrl: './case-transcripts-table.component.html',
  styleUrl: './case-transcripts-table.component.scss',
})
export class CaseTranscriptsTableComponent {
  transcripts = input<TranscriptsRow[]>([]);
  caseId = input<number>();

  statusColours = transcriptStatusTagColours;

  columns = [
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Type', prop: 'type', sortable: true },
    { name: 'Requested on', prop: 'requestedOn', sortable: true },
    { name: 'Requested by', prop: 'requestedBy', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
    { name: '', prop: '' },
  ];
}
