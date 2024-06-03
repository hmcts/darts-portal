import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-associated-audio-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, BytesPipe, LuxonDatePipe, DecimalPipe, RouterLink],
  templateUrl: './associated-audio-table.component.html',
  styleUrl: './associated-audio-table.component.scss',
})
export class AssociatedAudioTableComponent {
  rows = input([], { transform: this.mapRows });

  columns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'audioId', sortable: true },
    { name: 'Case ID', prop: 'caseId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Start time', prop: 'startTime', sortable: true },
    { name: 'End time', prop: 'endTime', sortable: true },
    { name: 'Courtoom', prop: 'courtroom', sortable: true },
    { name: 'Channel number', prop: 'channelNumber', sortable: true },
  ];

  mapRows(associatedAudio: AssociatedMedia[]) {
    return associatedAudio.map((audio) => ({
      audioId: audio.id,
      caseId: audio.case.id,
      hearingDate: audio.hearing.hearingDate,
      courthouse: audio.courthouse.displayName,
      startTime: audio.startAt,
      endTime: audio.endAt,
      courtroom: audio.courtroom.name,
      channelNumber: audio.channel,
    }));
  }
}
