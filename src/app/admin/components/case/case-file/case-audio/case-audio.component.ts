import { CaseAudio } from '@admin-types/case/case-audio/case-audio.type';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

export type CaseAudioSortBy = 'audioId' | 'courtroom' | 'startTime' | 'endTime' | 'channel';

@Component({
  selector: 'app-case-audio',
  imports: [DataTableComponent, LuxonDatePipe, RouterLink, TableRowTemplateDirective],
  templateUrl: './case-audio.component.html',
  styleUrl: './case-audio.component.scss',
})
export class CaseAudioComponent {
  caseId = input<number>();
  totalItems = input<number>();
  audiosPerPage = input<number>();

  audios = input<CaseAudio[]>([]);

  pageChange = output<number>();
  sortChange = output<{
    sortBy: CaseAudioSortBy;
    sortOrder: 'asc' | 'desc';
  }>();

  columns: DatatableColumn[] = [
    {
      name: 'Audio ID',
      prop: 'audioId',
      sortable: true,
    },
    {
      name: 'Courtroom',
      prop: 'courtroom',
      sortable: true,
    },
    {
      name: 'Start time',
      prop: 'startTime',
      sortable: true,
    },
    {
      name: 'End time',
      prop: 'endTime',
      sortable: true,
    },
    {
      name: 'Channel',
      prop: 'channel',
      sortable: true,
    },
  ];

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSortChange(sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
    if (!this.isAllowedSort(sort.sortBy)) return;

    this.sortChange.emit({
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });
  }

  private isAllowedSort(value: string): value is CaseAudioSortBy {
    return ['audioId', 'courtroom', 'startTime', 'endTime', 'channel'].includes(value);
  }
}
