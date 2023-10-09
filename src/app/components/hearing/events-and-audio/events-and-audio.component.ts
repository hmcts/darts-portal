import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { HearingEventTypeEnum } from '@darts-types/enums';
import { HearingAudio, HearingAudioEventViewModel, HearingEvent } from '@darts-types/index';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AudioPlayerComponent],
  templateUrl: './events-and-audio.component.html',
  styleUrls: ['./events-and-audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsAndAudioComponent implements OnInit, OnChanges, OnDestroy {
  @Input() audio: HearingAudio[] = [];
  @Input() events: HearingEvent[] = [];

  @Output() eventsSelect = new EventEmitter<HearingAudioEventViewModel[]>();

  table: HearingAudioEventViewModel[] = [];
  filteredTable: HearingAudioEventViewModel[] = [];

  selectedRows: HearingAudioEventViewModel[] = [];

  eventsFilterForm = new FormGroup({ selectedOption: new FormControl('all') });
  formChanges$ = this.eventsFilterForm.valueChanges;

  subs: Subscription[] = [];
  audioInPreview: number[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.formChanges$.subscribe((valueChanges) => {
        this.onFilterChanged(valueChanges.selectedOption as string);
      })
    );
  }

  ngOnChanges(): void {
    this.constructTable();
  }

  toggleRowSelection(row: HearingAudioEventViewModel) {
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

  isRowSelected(row: HearingAudioEventViewModel) {
    return this.selectedRows.includes(row);
  }

  onSelectAllChanged(checked: boolean) {
    if (checked) {
      this.selectedRows = [...this.filteredTable];
    } else {
      this.selectedRows = [];
    }
    this.eventsSelect.emit(this.selectedRows);
  }

  onFilterChanged(selectedOption: string) {
    if (selectedOption === 'all') {
      this.filteredTable = [...this.table];
    } else {
      this.filteredTable = this.table.filter((row) => row.type === HearingEventTypeEnum.Event);
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

  private constructTable() {
    this.mapEventsAndAudioToTable();
    this.sortTableByTimeStamp(this.table);
    this.filteredTable = [...this.table];
  }

  private mapEventsAndAudioToTable() {
    this.table = [
      ...this.audio.map((audio) => ({
        ...audio,
        type: HearingEventTypeEnum.Audio,
        timestamp: audio.media_start_timestamp,
      })),
      ...this.events.map((event) => ({ ...event, type: HearingEventTypeEnum.Event })),
    ];
  }

  private sortTableByTimeStamp(table: HearingAudioEventViewModel[]) {
    table.sort((a, b) => {
      const timestampA = DateTime.fromISO(a.timestamp || '')
        .toUTC()
        .toUnixInteger();
      const timestampB = DateTime.fromISO(b.timestamp || '')
        .toUTC()
        .toUnixInteger();

      return timestampA - timestampB;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
