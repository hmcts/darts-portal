import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { Component, Input, inject, input, model } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-associated-audio-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, RouterLink],
  templateUrl: './associated-audio-table.component.html',
  styleUrl: './associated-audio-table.component.scss',
})
export class AssociatedAudioTableComponent {
  router = inject(Router);

  @Input() hideOrDeleteView = false;
  @Input() rowSelect = false;
  @Input() transformedMediaId!: number;
  rows = input<AssociatedMedia[]>([]);

  selectedRows = model<AssociatedMedia[]>([]);

  columns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'id', sortable: true },
    { name: 'Courthouse', prop: 'courthouseName', sortable: true },
    { name: 'Courtroom', prop: 'courtroomName', sortable: true },
    { name: 'Start time', prop: 'startAt', sortable: true },
    { name: 'End time', prop: 'endAt', sortable: true },
    { name: 'Channel number', prop: 'channel', sortable: true },
    { name: 'Is current?', prop: 'isCurrent' },
  ];
}
