import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { UserState } from '@core-types/user/user-state.interface';
import { Hearing, PostAudioRequest } from '@portal-types/index';
import { UserService } from '@services/user/user.service';
import { beforeTimeValidator } from '@validators/before-time.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { DateTime } from 'luxon';
import { TimeInputComponent, timeInputFormControls } from './time-input/time-input.component';

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
export class RequestPlaybackAudioComponent implements OnChanges, OnInit {
  @Input() courthouseId!: number;
  @Input() hearing!: Hearing;
  @Input() audioTimes: { startTime: DateTime; endTime: DateTime } | null = null;
  @Input() userState!: UserState;
  audioRequestForm: FormGroup;
  requestObj!: PostAudioRequest;
  @Output() audioRequest = new EventEmitter<PostAudioRequest>();
  @Output() validationErrorEvent = new EventEmitter<ErrorSummaryEntry[]>();
  public isSubmitted = false;
  errorSummary: ErrorSummaryEntry[] = [];

  constructor(
    private fb: FormBuilder,
    public userService: UserService
  ) {
    this.audioRequestForm = this.fb.group(
      {
        startTime: this.fb.group(timeInputFormControls, { validators: timeGroupValidator }),
        endTime: this.fb.group(timeInputFormControls, { validators: timeGroupValidator }),
        requestType: [''],
      },
      { validators: beforeTimeValidator }
    );
  }
  ngOnInit(): void {
    const requestTypeRequired =
      this.userService.isCourthouseTranscriber(this.courthouseId) ||
      this.userService.isAdmin() ||
      this.userService.isSuperUser();
    if (requestTypeRequired) {
      this.audioRequestForm.get('requestType')?.setValidators(Validators.required);
    } else {
      this.audioRequestForm.get('requestType')?.patchValue('PLAYBACK');
    }
    this.audioRequestForm.get('requestType')?.updateValueAndValidity();
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

    if (this.audioRequestForm.invalid) {
      if (!this.audioRequestForm.controls.endTime.invalid && this.audioRequestForm.errors?.endTimeBeforeStartTime) {
        errorMessages.push({
          fieldId: 'end-time-hour-input',
          message: 'End time must be after start time',
        });
      }
    }

    this.validationErrorEvent.emit(errorMessages);
  }

  public setTimes(): void {
    this.audioRequestForm.patchValue({
      startTime: {
        hours: this.audioTimes?.startTime.hour.toString().padStart(2, '0'),
        minutes: this.audioTimes?.startTime.minute.toString().padStart(2, '0'),
        seconds: this.audioTimes?.startTime.second.toString().padStart(2, '0'),
      },
      endTime: {
        hours: this.audioTimes?.endTime.hour.toString().padStart(2, '0'),
        minutes: this.audioTimes?.endTime.minute.toString().padStart(2, '0'),
        seconds: this.audioTimes?.endTime.second.toString().padStart(2, '0'),
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.audioTimes?.currentValue !== null) {
      this.setTimes();
    } else {
      this.audioRequestForm.get('startTime')?.reset();
      this.audioRequestForm.get('endTime')?.reset();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.onValidationError();
    const startTimeHours = this.audioRequestForm.get('startTime.hours')?.value;
    const startTimeMinutes = this.audioRequestForm.get('startTime.minutes')?.value;
    const startTimeSeconds = this.audioRequestForm.get('startTime.seconds')?.value;
    const endTimeHours = this.audioRequestForm.get('endTime.hours')?.value;
    const endTimeMinutes = this.audioRequestForm.get('endTime.minutes')?.value;
    const endTimeSeconds = this.audioRequestForm.get('endTime.seconds')?.value;

    const hearingDate = this.hearing.date.toFormat('yyyy-LL-dd');

    const startDateTime = DateTime.fromISO(`${hearingDate}T${startTimeHours}:${startTimeMinutes}:${startTimeSeconds}`);

    const endDateTime = DateTime.fromISO(`${hearingDate}T${endTimeHours}:${endTimeMinutes}:${endTimeSeconds}`);

    //Refuse to submit if form is invalid
    if (
      !startDateTime.isValid ||
      !endDateTime.isValid ||
      this.audioRequestForm.get('requestType')?.invalid ||
      this.audioRequestForm.errors?.endTimeBeforeStartTime
    )
      return;

    this.requestObj = {
      hearing_id: this.hearing.id,
      requestor: this.userState.userId,
      start_time: startDateTime.toISO({ suppressMilliseconds: true, includeOffset: false }),
      end_time: endDateTime.toISO({ suppressMilliseconds: true, includeOffset: false }),
      request_type: this.audioRequestForm.get('requestType')?.value,
    };

    this.audioRequest.emit(this.requestObj);
  }
}
