import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, input } from '@angular/core';
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
  @Input() hideOrDeleteView = false;
  @Input() rowSelect = false;

  @Output() selectedRows = new EventEmitter<ReturnType<typeof this.mapRows>>();

  rows = input([], { transform: this.mapRows });

  columns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'audioId', sortable: true },
    { name: 'Case ID', prop: 'caseId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Start time', prop: 'startTime', sortable: true },
    { name: 'End time', prop: 'endTime', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Channel number', prop: 'channelNumber', sortable: true },
  ];

  setSelectedRows(selectedRows: ReturnType<typeof this.mapRows>) {
    this.selectedRows.emit(selectedRows);
  }

  mapRows(associatedAudio: AssociatedMedia[]) {
    return associatedAudio.map((audio) => ({
      audioId: audio.id,
      caseId: audio.case.id,
      caseNumber: audio.case.caseNumber,
      hearingDate: audio.hearing.hearingDate,
      hearingId: audio.hearing.id,
      courthouse: audio.courthouse.displayName,
      startTime: audio.startAt,
      endTime: audio.endAt,
      courtroom: audio.courtroom.displayName,
      channelNumber: audio.channel,
    }));
  }
}
