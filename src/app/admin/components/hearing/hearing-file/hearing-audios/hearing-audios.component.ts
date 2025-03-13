import { HearingAudio } from '@admin-types/hearing/hearing-audio.type';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-hearing-audios',
  imports: [GovukHeadingComponent, DataTableComponent, RouterLink, LuxonDatePipe, TableRowTemplateDirective],
  templateUrl: './hearing-audios.component.html',
  styleUrl: './hearing-audios.component.scss',
})
export class HearingAudiosComponent {
  audios = input<HearingAudio[]>([]);
  url = input();

  columns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'id', sortable: true },
    { name: 'Filename', prop: 'filename', sortable: true },
    { name: 'Start time', prop: 'startAt', sortable: true },
    { name: 'End time', prop: 'endAt', sortable: true },
    { name: 'Channel number', prop: 'channel', sortable: true },
  ];
}
