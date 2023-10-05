import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeInputComponent } from './time-input/time-input.component';
import * as moment from 'moment';
import { DateTimeService } from '@services/datetime/datetime.service';
import { AudioRequest, ErrorSummaryEntry, FieldErrors, Hearing } from '@darts-types/index';
import { timeGroupValidator } from '@validators/time-group.validator';
import { UserState } from '@darts-types/user-state';
import { ActivatedRoute } from '@angular/router';

const fieldErrors: FieldErrors = {
  startTime: {
    required: 'You must include a start time for your audio recording',
  },
  endTime: {
    required: 'You must include an end time for your audio recording',
  },
  requestType: {
    required: 'You must select a request type',
  },
};

@Component({
  selector: 'app-request-playback-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimeInputComponent],
  templateUrl: './request-playback-audio.component.html',
  styleUrls: ['./request-playback-audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestPlaybackAudioComponent implements OnChanges {
  @Input() hearing!: Hearing;
  @Input() requestAudioTimes!: Map<string, Date> | undefined;
  @Input() userProfile!: UserState | undefined | null;
  audioRequestForm: FormGroup;
  requestObj!: AudioRequest;
  @Output() audioRequest = new EventEmitter<AudioRequest>();
  @Output() validationErrorEvent = new EventEmitter<ErrorSummaryEntry[]>();
  public isSubmitted = false;
  errorSummary: ErrorSummaryEntry[] = [];
  public userState!: UserState;

  constructor(
    private fb: FormBuilder,
    public datetimeService: DateTimeService,
    private route: ActivatedRoute
  ) {
    this.userState = this.route.snapshot.data.userState;
    this.audioRequestForm = this.fb.group({
      startTime: this.fb.group(
        {
          hours: [null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
          minutes: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
          seconds: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        },
        { validators: timeGroupValidator }
      ),
      endTime: this.fb.group(
        {
          hours: [null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
          minutes: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
          seconds: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        },
        { validators: timeGroupValidator }
      ),
      requestType: ['', [Validators.required]],
    });
  }

  get f() {
    return this.audioRequestForm.controls;
  }

  getFieldErrorMessages(fieldName: string): string[] {
    const errors = this.f[fieldName].errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((errorType) => fieldErrors[fieldName][errorType]);
  }

  public isTranscriber(): boolean {
    const roles = this.userState.roles;
    return roles.some((x) => x.roleName === 'TRANSCRIBER');
  }

  public onValidationError() {
    const formControls = this.f;
    const idHashMap = new Map<string, string>();

    idHashMap.set('startTime', 'start-time-hour-input');
    idHashMap.set('endTime', 'end-time-hour-input');
    idHashMap.set('requestType', 'playback-radio');

    const errorMessages: ErrorSummaryEntry[] = Object.keys(formControls)
      .filter((fieldId) => formControls[fieldId].errors)
      .map((fieldId) =>
        this.getFieldErrorMessages(fieldId).map((message) => ({ fieldId: idHashMap.get(fieldId) ?? '', message }))
      )
      .flat();

    this.validationErrorEvent.emit(errorMessages);
  }

  public setTimes(): void {
    this.audioRequestForm.patchValue({
      startTime: {
        hours: this.requestAudioTimes?.get('startDateTime')?.getHours().toString().padStart(2, '0'),
        minutes: this.requestAudioTimes?.get('startDateTime')?.getMinutes().toString().padStart(2, '0'),
        seconds: this.requestAudioTimes?.get('startDateTime')?.getSeconds().toString().padStart(2, '0'),
      },
      endTime: {
        hours: this.requestAudioTimes?.get('endDateTime')?.getHours().toString().padStart(2, '0'),
        minutes: this.requestAudioTimes?.get('endDateTime')?.getMinutes().toString().padStart(2, '0'),
        seconds: this.requestAudioTimes?.get('endDateTime')?.getSeconds().toString().padStart(2, '0'),
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.requestAudioTimes.currentValue !== undefined) {
      this.setTimes();
    } else {
      this.audioRequestForm.get('startTime')?.reset();
      this.audioRequestForm.get('endTime')?.reset();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.isTranscriber()
      ? this.audioRequestForm.get('requestType')?.value
      : this.audioRequestForm.get('requestType')?.patchValue('PLAYBACK');
    this.onValidationError();
    const startTimeHours = this.audioRequestForm.get('startTime.hours')?.value;
    const startTimeMinutes = this.audioRequestForm.get('startTime.minutes')?.value;
    const startTimeSeconds = this.audioRequestForm.get('startTime.seconds')?.value;
    const endTimeHours = this.audioRequestForm.get('endTime.hours')?.value;
    const endTimeMinutes = this.audioRequestForm.get('endTime.minutes')?.value;
    const endTimeSeconds = this.audioRequestForm.get('endTime.seconds')?.value;

    const startDateTime = moment.utc(`${this.hearing.date}T${startTimeHours}:${startTimeMinutes}:${startTimeSeconds}`);
    const endDateTime = moment.utc(`${this.hearing.date}T${endTimeHours}:${endTimeMinutes}:${endTimeSeconds}`);

    if (!startDateTime.isValid() && !endDateTime.isValid()) return;

    this.requestObj = {
      hearing_id: this.hearing.id,
      requestor: this.userProfile?.userId as number,
      start_time: this.datetimeService.getIsoStringWithoutMilliseconds(startDateTime.toISOString()),
      end_time: this.datetimeService.getIsoStringWithoutMilliseconds(endDateTime.toISOString()),
      request_type: this.audioRequestForm.get('requestType')?.value,
    };
    this.audioRequest.emit(this.requestObj);
  }
}
