import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DataTableColumn, DataTableComponent } from '@common/data-table/data-table.component';
import { Hearing } from '@darts-types/index';
import { TabDirective } from 'src/app/directives/tab.directive';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, TabsComponent, TabDirective],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent implements OnChanges {
  @Input() hearings: Hearing[] = [];
  caseId: number;
  rows: Hearing[] = [];
  columns: DataTableColumn[] = [];

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.caseId = this.route.snapshot.params.caseId;

    this.columns = [
      {
        name: 'Hearing date',
        prop: 'date',
        link: '/case/' + this.caseId + '/hearing/',
        sortable: true,
      },
      { name: 'Judge', prop: 'judges', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'No. of transcripts', prop: 'transcript_count', sortable: true },
    ];
  }

  ngOnChanges() {
    this.rows = this.hearings.map((hearing: Hearing) => {
      return {
        id: hearing.id,
        date: this.datePipe.transform(hearing.date, 'd MMM y') as string,
        judges: hearing.judges,
        courtroom: hearing.courtroom,
        transcript_count: hearing.transcript_count,
      };
    });
  }
}
