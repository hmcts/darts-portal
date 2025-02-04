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
import { ErrorSummaryEntry, FormErrorMessages } from '@core-types/index';
import { UserState } from '@core-types/user/user-state.interface';
import { Hearing, HearingAudio, PostAudioRequest } from '@portal-types/index';
import { UserService } from '@services/user/user.service';
import { beforeTimeValidator } from '@validators/before-time.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { DateTime } from 'luxon';
import { TimeInputComponent, timeInputFormControls } from './time-input/time-input.component';

export const fieldErrors: FormErrorMessages = {
  startTime: {
    required: 'You must include a start time for your audio recording',
    unavailable: 'There is no audio available for this start time',
    invalidTime: 'Enter a time in the correct format (for example 15:11:11)',
  },
  endTime: {
    required: 'You must include an end time for your audio recording',
    unavailable: 'There is no audio available for this end time',
    endTimeAfterStart: 'End time must be after start time',
    invalidTime: 'Enter a time in the correct format (for example 15:11:11)',
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

  requestTypeRequired = false;

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
    // Roles that allow selection of request type
    this.requestTypeRequired =
      this.userService.isCourthouseTranscriber(this.courthouseId) ||
      this.userService.isAdmin() ||
      this.userService.isSuperUser() ||
      this.userService.isRCJAppeals();

    if (this.requestTypeRequired) {
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

    this.errorSummary = this.getErrorSummary();

    if (this.audioRequestForm.invalid) {
      if (!this.audioRequestForm.controls.startTime.errors?.invalidTime) {
        this.errorSummary.push({
          fieldId: 'start-time-hour-input',
          message: fieldErrors.startTime.invalidTime,
        });
      }

      if (!this.audioRequestForm.controls.endTime.errors?.invalidTime) {
        this.errorSummary.push({
          fieldId: 'end-time-hour-input',
          message: fieldErrors.endTime.invalidTime,
        });
      }

      if (!this.audioRequestForm.controls.endTime.invalid && this.audioRequestForm.errors?.endTimeBeforeStartTime) {
        this.audioRequestForm.controls.endTime.setErrors({ endTimeAfterStart: true });
        this.errorSummary.push({
          fieldId: 'end-time-hour-input',
          message: fieldErrors.endTime.endTimeAfterStart,
        });
      }
    }

    // if (this.errorSummary.length > 0) this.validationErrorEvent.emit(this.errorSummary);
    if (this.errorSummary.length > 0) {
      const uniqueErrorMessages = [...new Map([...this.errorSummary].map((entry) => [entry.message, entry])).values()];
      this.validationErrorEvent.emit(uniqueErrorMessages);
    }
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

  //Gets Validation field errors generically for all fields
  private getErrorSummary() {
    const formControls = this.f;
    const idHashMap = new Map<string, string>();

    idHashMap.set('startTime', 'start-time-hour-input');
    idHashMap.set('endTime', 'end-time-hour-input');
    idHashMap.set('requestType', 'playback-radio');

    return Object.keys(formControls)
      .filter((fieldId) => formControls[fieldId].errors)
      .map((fieldId) =>
        this.getFieldErrorMessages(fieldId).map((message) => ({ fieldId: idHashMap.get(fieldId) ?? '', message }))
      )
      .flat();
  }

  //Checks if audio exists within the range of the times
  private outsideAudioTimesValidation(startTime: DateTime, endTime: DateTime): void {
    const errorMessages: ErrorSummaryEntry[] = [];
    let isAudioWithinRange = false;

    //Comparing only times not dates
    const startTimeOnly = startTime.set({ year: 0, month: 1, day: 1, millisecond: 0 });
    const endTimeOnly = endTime.set({ year: 0, month: 1, day: 1, millisecond: 0 });

    //Check there is at least one audio within start/end range
    isAudioWithinRange = this.audios.some((audio) => {
      const audioStartTime = DateTime.fromISO(audio.media_start_timestamp).set({
        year: 0,
        month: 1,
        day: 1,
        millisecond: 0,
      });
      const audioEndTime = DateTime.fromISO(audio.media_end_timestamp).set({
        year: 0,
        month: 1,
        day: 1,
        millisecond: 0,
      });
      return (
        (startTimeOnly <= audioStartTime && endTimeOnly >= audioStartTime) ||
        (startTimeOnly <= audioEndTime && endTimeOnly >= audioEndTime) ||
        (startTimeOnly >= audioStartTime && endTimeOnly <= audioEndTime)
      );
    });

    if (!isAudioWithinRange) {
      this.audioRequestForm.controls.startTime.setErrors({ unavailable: true });
      this.audioRequestForm.controls.endTime.setErrors({ unavailable: true });
      this.audioRequestForm.setErrors({ invalid: true });
      errorMessages.push({
        fieldId: 'start-time-hour-input',
        message: fieldErrors.startTime.unavailable,
      });
      errorMessages.push({
        fieldId: 'end-time-hour-input',
        message: fieldErrors.endTime.unavailable,
      });
    } else {
      //Reset in case of previous stored errors
      this.audioRequestForm.controls.startTime.setErrors(null);
      this.audioRequestForm.controls.endTime.setErrors(null);
      this.validationErrorEvent.emit(this.getErrorSummary());
    }

    if (errorMessages.length > 0) {
      const uniqueErrorMessages = [
        ...new Map([...errorMessages, ...this.errorSummary].map((entry) => [entry.message, entry])).values(),
      ];
      this.validationErrorEvent.emit(uniqueErrorMessages);
    }
  }

  private clearErrors(): void {
    this.audioRequestForm.controls.startTime.setErrors(null);
    this.audioRequestForm.controls.endTime.setErrors(null);
    this.validationErrorEvent.emit([]);
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
    if (
      this.audios.length > 0 &&
      !this.audioRequestForm.errors?.endTimeBeforeStartTime &&
      startDateTime.isValid &&
      endDateTime.isValid
    ) {
      this.outsideAudioTimesValidation(startDateTime, endDateTime);
    }

    //Refuse to submit if form is invalid
    if (
      !startDateTime.isValid ||
      !endDateTime.isValid ||
      this.audioRequestForm.get('requestType')?.invalid ||
      this.audioRequestForm.errors?.endTimeBeforeStartTime ||
      this.audioRequestForm.invalid
    )
      return;

    this.clearErrors();

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
