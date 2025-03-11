import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { DatatableColumn, TagColour } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Transcript, TranscriptStatus } from '@portal-types/transcriptions';

@Component({
  selector: 'app-hearing-transcripts',
  imports: [
    DataTableComponent,
    GovukHeadingComponent,
    LuxonDatePipe,
    RouterLink,
    GovukTagComponent,
    TableRowTemplateDirective,
  ],
  templateUrl: './hearing-transcripts.component.html',
  styleUrl: './hearing-transcripts.component.scss',
})
export class HearingTranscriptsComponent {
  transcripts = input<Transcript[]>([]);
  url = input();

  transcriptStatusClassMap = transcriptStatusTagColours;

  columns: DatatableColumn[] = [
    { name: 'Transcript ID', prop: 'id', sortable: true },
    { name: 'Type', prop: 'type', sortable: true },
    { name: 'Requested by', prop: 'requestedByName', sortable: true },
    { name: 'Requested on', prop: 'requestedOn', sortable: true },
    { name: 'Status', prop: 'status', sortable: true },
  ];

  getTranscriptStatusColour(status: string): TagColour {
    return this.transcriptStatusClassMap[status as TranscriptStatus];
  }
}
