import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingAudio, HearingEvent, HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { HearingEventTypeEnum } from 'src/app/types/enums';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-and-audio.component.html',
  styleUrls: ['./events-and-audio.component.scss'],
})
export class EventsAndAudioComponent implements OnInit {
  @Input() audio: HearingAudio[] = [];
  @Input() events: HearingEvent[] = [];

  @Output() eventsSelect = new EventEmitter<HearingAudioEventViewModel[]>();

  table: HearingAudioEventViewModel[] = [];
  selectedRows: HearingAudioEventViewModel[] = [];

  ngOnInit(): void {
    this.table = [
      ...this.audio.map((audio) => ({ ...audio, type: HearingEventTypeEnum.Audio })),
      ...this.events.map((event) => ({ ...event, type: HearingEventTypeEnum.Event })),
    ];
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
}
