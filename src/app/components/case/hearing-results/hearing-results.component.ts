import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { Hearing } from '@darts-types/index';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, TabsComponent],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent implements OnChanges {
  @Input() hearings: Hearing[] = [];
  tabs: string[];
  caseId: number;
  rows: any[] = [];
  columns: any[] = [];

  constructor(private route: ActivatedRoute, private datePipe: DatePipe) {
    this.caseId = this.route.snapshot.params.caseId;
    this.tabs = ['Hearings', 'Transcripts'];

    this.columns = [
      {
        name: 'Hearing date',
        prop: 'date',
        link: '/case/' + this.caseId + '/hearing/',
      },
      { name: 'Judge', prop: 'judges' },
      { name: 'Courtroom', prop: 'courtroom' },
      { name: 'No. of transcripts', prop: 'transcript_count' },
    ];
  }

  ngOnChanges() {
    this.rows = this.hearings.map((hearing: Hearing) => {
      return {
        id: hearing.id,
        date: this.datePipe.transform(hearing.date, 'd MMM y'),
        judges: hearing.judges,
        courtroom: hearing.courtroom,
        transcript_count: hearing.transcript_count,
      };
    });
  }
}
