import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DatatableColumn } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Hearing, TranscriptsRow } from '@portal-types/index';
import { transcriptStatusClassMap } from 'src/app/constants/transcript-status-class-map';
import { TabDirective } from 'src/app/directives/tab.directive';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataTableComponent,
    TabsComponent,
    TabDirective,
    TableRowTemplateDirective,
    LuxonDatePipe,
  ],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HearingResultsComponent {
  @Input() hearings: Hearing[] = [];
  @Input() transcripts: TranscriptsRow[] = [];
  caseId: number;
  hearingsColumns: DatatableColumn[] = [];
  transcriptColumns: DatatableColumn[] = [];

  transcriptStatusClassMap = transcriptStatusClassMap;

  constructor(private route: ActivatedRoute) {
    this.caseId = this.route.snapshot.params.caseId;

    this.hearingsColumns = [
      { name: 'Hearing date', prop: 'date', sortable: true },
      { name: 'Judge', prop: 'judges', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'No. of transcripts', prop: 'transcriptCount', sortable: true },
    ];

    this.transcriptColumns = [
      { name: 'Hearing date', prop: 'hearingDate', sortable: true },
      { name: 'Type', prop: 'type', sortable: true },
      { name: 'Requested on', prop: 'requestedOn', sortable: true },
      { name: 'Requested by', prop: 'requestedBy', sortable: true },
      { name: 'Status', prop: 'status', sortable: true },
      { name: '', prop: '' },
    ];
  }
}
