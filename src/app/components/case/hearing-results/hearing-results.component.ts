import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn, DatatableRow, Hearing } from '@darts-types/index';
import { TabDirective } from 'src/app/directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, TabsComponent, TabDirective, TableRowTemplateDirective],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent implements OnChanges {
  @Input() hearings: Hearing[] = [];
  caseId: number;
  rows: DatatableRow[] = [];
  columns: DatatableColumn[] = [];

  constructor(private route: ActivatedRoute) {
    this.caseId = this.route.snapshot.params.caseId;

    this.columns = [
      { name: 'Hearing date', prop: 'date', sortable: true },
      { name: 'Judge', prop: 'judges', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'No. of transcripts', prop: 'transcripts', sortable: true },
    ];
  }

  ngOnChanges() {
    this.rows = this.hearings.map((hearing: Hearing) => {
      return {
        id: hearing.id,
        date: hearing.date,
        judges: hearing.judges,
        courtroom: hearing.courtroom,
        transcripts: hearing.transcript_count,
      };
    });
  }
}
