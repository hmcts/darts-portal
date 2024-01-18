import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { HearingEventTypeEnum } from '@darts-types/enums';
import { AudioEventRow, DatatableColumn, HearingAudio, HearingEvent } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { AudioPreviewService } from '@services/audio-preview/audio-preview.service';
import { DateTime } from 'luxon';
import { Subscription, catchError, of } from 'rxjs';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AudioPlayerComponent, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './events-and-audio.component.html',
  styleUrls: ['./events-and-audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsAndAudioComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren(AudioPlayerComponent) audioPlayers!: QueryList<AudioPlayerComponent>;
  @Input() audio: HearingAudio[] = [];
  @Input() events: HearingEvent[] = [];
  @Output() eventsSelect = new EventEmitter<AudioEventRow[]>();
  audioPreviewService = inject(AudioPreviewService);

  columns: DatatableColumn[] = [
    { name: 'Time', prop: 'timestamp', sortable: true, width: '180px' },
    { name: 'Event', prop: 'event' },
    { name: 'Text', prop: 'text', width: '700px' },
  ];

  rows: AudioEventRow[] = [];
  filteredRows: AudioEventRow[] = [];

  selectedRows: AudioEventRow[] = [];
  selectedOption = new FormControl('all');
  formChanges$ = this.selectedOption.valueChanges;

  subs: Subscription[] = [];
  audioInPreview: number[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.formChanges$.subscribe((valueChanges) => {
        this.onFilterChanged(valueChanges as string);
      })
    );
  }

  ngOnChanges(): void {
    this.constructTable();
  }

  onRowSelect(rows: AudioEventRow[]) {
    this.eventsSelect.emit(rows);
  }

  toggleRowSelection(row: AudioEventRow) {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      // Row not selected, add it to the selection
      this.selectedRows.push(row);
    } else {
      // Row already selected, remove it from the selection
      this.selectedRows.splice(index, 1);
    }
    this.eventsSelect.emit(this.selectedRows);
  }

  isRowSelected(row: AudioEventRow) {
    return this.selectedRows.includes(row);
  }

  onSelectAllChanged(checked: boolean) {
    if (checked) {
      this.selectedRows = [...this.filteredRows];
    } else {
      this.selectedRows = [];
    }
    this.eventsSelect.emit(this.selectedRows);
  }

  onFilterChanged(selectedOption: string) {
    if (selectedOption === 'all') {
      this.filteredRows = [...this.rows];
    } else {
      this.filteredRows = this.rows.filter((row) => row.type === HearingEventTypeEnum.Event);
    }
  }

  onPreviewAudio(id: number) {
    if (!this.isAudioInPreview(id)) {
      this.audioInPreview = [...this.audioInPreview, id];
    }
  }

  isAudioInPreview(id: number): boolean {
    return !!this.audioInPreview.find((audioId) => audioId === id);
  }

  onAudioPlay(id: number) {
    this.audioPlayers.toArray().forEach((player) => {
      if (player.id !== id) {
        player?.pausePlayer();
      }
    });
  }

  private constructTable() {
    this.mapEventsAndAudioToTable();
    this.sortTableByTimeStamp(this.rows);
    this.filteredRows = [...this.rows];
  }

  private mapEventsAndAudioToTable() {
    this.rows = [
      ...this.audio.map((audio) => ({
        ...audio,
        type: HearingEventTypeEnum.Audio,
        timestamp: audio.media_start_timestamp,
        audioSourceUrl$: this.audioPreviewService
          .getAudioPreviewBlobUrl(audio.id)
          .pipe(catchError((failedUrl: string) => of(failedUrl))),
      })),
      ...this.events.map((event) => ({ ...event, type: HearingEventTypeEnum.Event })),
    ];
  }

  private sortTableByTimeStamp(table: AudioEventRow[]) {
    table.sort((a, b) => {
      const timestampA = DateTime.fromISO(a.timestamp ?? '')
        .toUTC()
        .toUnixInteger();
      const timestampB = DateTime.fromISO(b.timestamp ?? '')
        .toUTC()
        .toUnixInteger();

      return timestampA - timestampB;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
