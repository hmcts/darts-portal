import { Component, Input, OnInit, EventEmitter, Output, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingAudio, HearingEvent, HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { HearingEventTypeEnum } from 'src/app/types/enums';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events-and-audio.component.html',
  styleUrls: ['./events-and-audio.component.scss'],
})
export class EventsAndAudioComponent implements OnInit, OnChanges, OnDestroy {
  @Input() audio: HearingAudio[] = [];
  @Input() events: HearingEvent[] = [];

  @Output() eventsSelect = new EventEmitter<HearingAudioEventViewModel[]>();

  table: HearingAudioEventViewModel[] = [];
  filteredTable: HearingAudioEventViewModel[] = [];

  selectedRows: HearingAudioEventViewModel[] = [];

  form = new FormGroup({ selectedOption: new FormControl('all') });
  formChanges$ = this.form.valueChanges;

  subs: Subscription[] = [];

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

  onFilterChanged(selectedOption: string) {
    if (selectedOption === 'all') {
      this.filteredTable = [...this.table];
    } else {
      this.filteredTable = this.table.filter((row) => row.type === HearingEventTypeEnum.Event);
    }
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
      const timestampA = new Date(a.timestamp || '').getTime();
      const timestampB = new Date(b.timestamp || '').getTime();

      return timestampB - timestampA;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
