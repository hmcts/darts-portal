import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { AudioEventRow, DatatableColumn } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { Hearing, HearingEvent } from '@portal-types/index';
import { timeGroupValidator } from '@validators/time-group.validator';
import { DateTime } from 'luxon';
import { TimeInputComponent } from 'src/app/portal/components/hearing/request-playback-audio/time-input/time-input.component';

@Component({
  selector: 'app-request-times',
  standalone: true,
  imports: [CommonModule, TimeInputComponent, ReactiveFormsModule, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './request-times.component.html',
  styleUrls: ['./request-times.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTimesComponent {
  @ViewChild('eventTable', { static: false }) eventTable!: DataTableComponent<HearingEvent>;
  fb = inject(FormBuilder);
  @Input() audioRows: AudioEventRow[] = [];
  @Input() events: HearingEvent[] = [];
  @Input() hearing!: Hearing;
  @Output() continue = new EventEmitter<{ startTime: DateTime | null; endTime: DateTime | null }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<{ fieldId: string; message: string }[]>();

  validationErrors: { fieldId: string; message: string }[] = [];

  audioColumns: DatatableColumn[] = [
    { name: 'Start Time', prop: 'media_start_timestamp', sortable: true },
    { name: 'End Time', prop: 'media_end_timestamp', sortable: true },
  ];

  eventColumns: DatatableColumn[] = [
    { name: 'Time', prop: 'timestamp', sortable: true },
    { name: 'Event', prop: 'name', sortable: true },
    { name: 'Text', prop: 'text', sortable: true },
  ];

  isSubmitted = false;

  form = this.fb.group({
    startTime: this.fb.group(
      {
        hours: ['', [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      },
      { validators: timeGroupValidator }
    ),
    endTime: this.fb.group(
      {
        hours: ['', [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      },
      { validators: timeGroupValidator }
    ),
  });

  onEventRowSelected(events: HearingEvent[]) {
    if (events.length) {
      const timestamps = events.map((event) => DateTime.fromISO(event.timestamp).toUTC().toUnixInteger());
      const startTime = DateTime.fromSeconds(Math.min(...timestamps)).toUTC();
      const endTime = DateTime.fromSeconds(Math.max(...timestamps)).toUTC();
      this.setFormValues({ startTime, endTime });
    } else {
      this.setFormValues({ startTime: null, endTime: null });
    }
  }

  setFormValues({ startTime, endTime }: { startTime: DateTime | null; endTime: DateTime | null }) {
    if (!startTime || !endTime) {
      this.form.reset();
    } else {
      this.form.patchValue({
        startTime: {
          hours: startTime.hour.toString().padStart(2, '0'),
          minutes: startTime.minute.toString().padStart(2, '0'),
          seconds: startTime.second.toString().padStart(2, '0'),
        },
        endTime: {
          hours: endTime.hour.toString().padStart(2, '0'),
          minutes: endTime.minute.toString().padStart(2, '0'),
          seconds: endTime.second.toString().padStart(2, '0'),
        },
      });
    }
  }

  onCancel() {
    this.form.reset();
    this.eventTable.onSelectAllChanged(false);
    this.isSubmitted = false;
    this.cancel.emit();
  }

  onContinue() {
    this.isSubmitted = true;
    this.validationErrors = [];

    if (this.form.invalid) {
      if (this.form.controls.startTime.invalid) {
        this.validationErrors.push({
          fieldId: 'start-hour-input',
          message: 'Select a start time',
        });
      }
      if (this.form.controls.endTime.invalid) {
        this.validationErrors.push({
          fieldId: 'end-hour-input',
          message: 'Select an end time',
        });
      }
    }

    this.errors.emit(this.validationErrors);

    if (this.validationErrors.length) {
      return;
    }

    const { startTime, endTime } = this.getStartEndTimeFromForm();

    this.continue.emit({ startTime, endTime });
  }

  getStartEndTimeFromForm() {
    const startTimeHours = this.form.get('startTime.hours')?.value;
    const startTimeMinutes = this.form.get('startTime.minutes')?.value;
    const startTimeSeconds = this.form.get('startTime.seconds')?.value;
    const endTimeHours = this.form.get('endTime.hours')?.value;
    const endTimeMinutes = this.form.get('endTime.minutes')?.value;
    const endTimeSeconds = this.form.get('endTime.seconds')?.value;

    const hearingDate = this.hearing.date.toFormat('yyyy-LL-dd');

    const startTime = DateTime.fromISO(
      `${hearingDate}T${startTimeHours}:${startTimeMinutes}:${startTimeSeconds}Z`
    ).toUTC();
    const endTime = DateTime.fromISO(`${hearingDate}T${endTimeHours}:${endTimeMinutes}:${endTimeSeconds}Z`).toUTC();
    return { startTime, endTime };
  }
}