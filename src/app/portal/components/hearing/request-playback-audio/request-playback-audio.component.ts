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
import { Hearing, HearingAudio, PostAudioRequest } from '@portal-types/index';
import { UserService } from '@services/user/user.service';
import { beforeTimeValidator } from '@validators/before-time.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { DateTime } from 'luxon';
import { TimeInputComponent, timeInputFormControls } from './time-input/time-input.component';

export const fieldErrors: FieldErrors = {
  startTime: {
    required: 'You must include a start time for your audio recording',
    unavailable: 'There is no audio available for this start time',
  },
  endTime: {
    required: 'You must include an end time for your audio recording',
    unavailable: 'There is no audio available for this end time',
    endTimeAfterStart: 'End time must be after start time',
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
  @Input() audios!: HearingAudio[];
  @Input() audioTimes: { startTime: DateTime; endTime: DateTime } | null = null;
  @Input() userState!: UserState;
  audioRequestForm: FormGroup;
  requestObj!: PostAudioRequest;
  @Output() audioRequest = new EventEmitter<PostAudioRequest>();
  @Output() validationErrorEvent = new EventEmitter<ErrorSummaryEntry[]>();
  public isSubmitted = false;
  errorSummary: ErrorSummaryEntry[] = [];

  fieldErrors = fieldErrors;

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

    if (!errors || !this.isSubmitted) {
      return [];
    }
    return Object.keys(errors).map((errorType) => fieldErrors[fieldName][errorType]);
  }

  public onValidationError() {
    this.errorSummary = [];
    const formControls = this.f;
    const idHashMap = new Map<string, string>();

    idHashMap.set('startTime', 'start-time-hour-input');
    idHashMap.set('endTime', 'end-time-hour-input');
    idHashMap.set('requestType', 'playback-radio');

    //No audio available validation
    if (this.audios.length === 0) {
      this.audioRequestForm.controls.startTime.setErrors({ unavailable: true });
      this.audioRequestForm.controls.endTime.setErrors({ unavailable: true });
      this.audioRequestForm.setErrors({ invalid: true });
      this.errorSummary.push({
        fieldId: 'start-time-hour-input',
        message: fieldErrors.startTime.unavailable,
      });
      this.errorSummary.push({
        fieldId: 'end-time-hour-input',
        message: fieldErrors.endTime.unavailable,
      });

      this.validationErrorEvent.emit(this.errorSummary);
      return;
    }

    //Gets Validation field errors generically for all fields
    this.errorSummary = Object.keys(formControls)
      .filter((fieldId) => formControls[fieldId].errors)
      .map((fieldId) =>
        this.getFieldErrorMessages(fieldId).map((message) => ({ fieldId: idHashMap.get(fieldId) ?? '', message }))
      )
      .flat();

    if (this.audioRequestForm.invalid) {
      if (!this.audioRequestForm.controls.endTime.invalid && this.audioRequestForm.errors?.endTimeBeforeStartTime) {
        this.audioRequestForm.controls.endTime.setErrors({ endTimeAfterStart: true });
        this.errorSummary.push({
          fieldId: 'end-time-hour-input',
          message: fieldErrors.endTime.endTimeAfterStart,
        });
      }
    }

    this.validationErrorEvent.emit(this.errorSummary);
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

  private outsideAudioTimesValidation(startTime: DateTime, endTime: DateTime): void {
    const errorMessages: ErrorSummaryEntry[] = [];

    const sortedAudioDates = this.audios
      .map((audio) => [DateTime.fromISO(audio.media_start_timestamp), DateTime.fromISO(audio.media_end_timestamp)])
      .flat()
      .sort((a, b) => a.toMillis() - b.toMillis());

    const earliestDate = sortedAudioDates[0];
    const latestDate = sortedAudioDates[sortedAudioDates.length - 1];

    //Comparing only times not dates
    const startTimeOnly = startTime.set({ year: 0, month: 1, day: 1, millisecond: 0 });
    const endTimeOnly = endTime.set({ year: 0, month: 1, day: 1, millisecond: 0 });
    const earliestTime = earliestDate.set({ year: 0, month: 1, day: 1, millisecond: 0 });
    const latestTime = latestDate.set({ year: 0, month: 1, day: 1, millisecond: 0 });

    if (startTimeOnly < earliestTime || startTimeOnly > latestTime) {
      this.audioRequestForm.controls.startTime.setErrors({ unavailable: true });
      this.audioRequestForm.setErrors({ invalid: true });
      errorMessages.push({
        fieldId: 'start-time-hour-input',
        message: fieldErrors.startTime.unavailable,
      });
    }

    if (endTimeOnly < earliestTime || endTimeOnly > latestTime) {
      this.audioRequestForm.controls.endTime.setErrors({ unavailable: true });
      this.audioRequestForm.setErrors({ invalid: true });
      errorMessages.push({
        fieldId: 'end-time-hour-input',
        message: fieldErrors.endTime.unavailable,
      });
    }

    if (errorMessages.length > 0) {
      this.validationErrorEvent.emit([...errorMessages, ...this.errorSummary]);
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

    //If times are outside
    this.audios.length > 0 && this.outsideAudioTimesValidation(startDateTime, endDateTime);

    //Refuse to submit if form is invalid
    if (
      !startDateTime.isValid ||
      !endDateTime.isValid ||
      this.audioRequestForm.get('requestType')?.invalid ||
      this.audioRequestForm.errors?.endTimeBeforeStartTime ||
      this.audioRequestForm.invalid
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
