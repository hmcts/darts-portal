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
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HearingEventTypeEnum } from 'src/app/types/enums';
import { HearingAudio, HearingEvent, HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { TimeInputComponent } from './time-input/time-input.component';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimeInputComponent],
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

  audioRequestForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.audioRequestForm = this.fb.group({
      startTime: this.fb.group({
        hours: [null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      }),
      endTime: this.fb.group({
        hours: [null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      }),
      requestType: '',
    });

    this.audioRequestForm.valueChanges.subscribe(console.log);
  }

  onSubmit() {
    console.log(this.audioRequestForm.value);
  }
}
