import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { CaseRetentionPageState } from 'src/app/portal/models/case/case-retention-page-state.type';
import { CaseService } from '@services/case/case.service';
import { UserService } from '@services/user/user.service';
import { DateTime, Duration } from 'luxon';

@Component({
  selector: 'app-case-retention-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReportingRestrictionComponent,
    ValidationErrorSummaryComponent,
    GovukTextareaComponent,
    DatepickerComponent,
  ],
  templateUrl: './case-retention-change.component.html',
  styleUrls: ['./case-retention-change.component.scss'],
})
export class CaseRetentionChangeComponent {
  @Input() caseId!: number;
  @Input() state!: CaseRetentionPageState;
  @Input() currentRetentionDate!: string | null;
  @Input() originalRetentionDate!: string | null;

  @Output() stateChange = new EventEmitter<CaseRetentionPageState>();
  @Output() retentionDateChange = new EventEmitter<Date>();
  @Output() retentionReasonChange = new EventEmitter<string>();
  @Output() retentionPermanentChange = new EventEmitter<boolean>();

  private datePageFormat = 'dd/MM/yyyy';
  private dateApiFormat = 'yyyy-MM-dd';

  userService = inject(UserService);
  retainReasonFormControl = new FormControl('');
  retainOptionFormControl = new FormControl('');
  retainDateFormControl = new FormControl();
  datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);
  datePipe = inject(DatePipe);
  caseService = inject(CaseService);

  retentionCharacterLimit = 200;
  errors: { fieldId: string; message: string }[] = [];

  errorNoOption = 'Select an option';
  errorDate = '';
  errorNoReason = 'You must explain why you are making this change';

  setDateValue(value: string) {
    this.retainDateFormControl.patchValue(value);
  }

  isOptionInvalid(): boolean {
    return this.retainOptionFormControl.dirty && !this.retainOptionFormControl.value;
  }

  isDateInvalid(): boolean {
    return !!this.errorDate;
  }

  isReasonInvalid(): boolean {
    return this.retainReasonFormControl.dirty && !this.retainReasonFormControl.value;
  }

  onChangeDate() {
    this.errorDate = '';
    if (!!this.datePatternValidator(this.retainDateFormControl) || !this.retainDateFormControl.value) {
      this.errorDate = 'You have not entered a recognised date in the correct format (for example 31/01/2023)';
      return;
    }
    return;
  }

  onChangeOption() {
    this.errors = [];
    this.errorDate = '';
    this.retainDateFormControl.setValue('');
  }

  onConfirm() {
    this.errors = [];
    this.retainOptionFormControl.markAsDirty();
    // Check an option has been selected
    if (!this.retainOptionFormControl.value) {
      this.errors.push({
        fieldId: 'change-radios',
        message: this.errorNoOption,
      });
    }
    // Check a reason has been provided
    if (!this.retainReasonFormControl.value) {
      this.retainReasonFormControl.markAsDirty();
      this.errors.push({
        fieldId: 'change-reason',
        message: this.errorNoReason,
      });
    }
    const isPermanent = !(this.retainOptionFormControl.value === 'date');
    // Check a date has been provided
    if (!isPermanent) {
      this.onChangeDate();
      if (this.errorDate) {
        this.errors.push({
          fieldId: 'retention-date',
          message: this.errorDate,
        });
      }
    }

    if (!this.errors.length) {
      // As long as there's no other errors, make the call
      this.caseService
        .postCaseRetentionDateValidate({
          case_id: this.caseId,
          retention_date: this.retainDateFormControl.value
            ? DateTime.fromFormat(this.retainDateFormControl.value, this.datePageFormat).toFormat(this.dateApiFormat)
            : undefined,
          is_permanent_retention: isPermanent,
          // Comments do appear to be required for this call
          comments: this.retainReasonFormControl.value || '',
        })
        .subscribe({
          next: (response) => {
            if (response.retention_date) {
              const retention_date = DateTime.fromFormat(response.retention_date, this.dateApiFormat, {
                setZone: true,
              });
              // Convert to JS date and place into the EventEmitter
              this.retentionDateChange.emit(retention_date.toJSDate());
              this.retentionReasonChange.emit(this.retainReasonFormControl.value || '');
              this.retentionPermanentChange.emit(isPermanent);
              this.stateChange.emit('Confirm');
            }
          },
          error: (err) => {
            if (err?.error?.max_duration) {
              // Sanitise the output to something human readable,
              // For example: 1 Year, 2 Months and 3 Days
              const max_duration_split = err.error.max_duration.split(/[A-Z]/);
              const years = parseInt(max_duration_split[0]);
              // Don't include months which are 0
              const months = parseInt(max_duration_split[1]) || undefined;
              // Don't include days which are 0
              const days = parseInt(max_duration_split[2]) || undefined;
              const duration = Duration.fromObject({
                years,
                months,
                days,
              });
              this.errorDate = `You cannot retain a case for more than ${duration.toHuman({ listStyle: 'long' })} after the case closed`;
            } else if (err?.error?.latest_automated_retention_date) {
              // Sanitise the output to something human readable
              const earliestDate = DateTime.fromFormat(err.error.latest_automated_retention_date, this.dateApiFormat, {
                setZone: true,
              });
              this.errorDate = `You cannot set retention date earlier than ${earliestDate.toFormat(this.datePageFormat)}`;
            } else {
              // Otherwise, the only other error can be a permissions issue
              this.errorDate = `You do not have permission to reduce the current retention date. Please refer to the DARTS retention policy guidance`;
            }
            this.errors.push({
              fieldId: 'retention-date',
              message: this.errorDate,
            });
            return;
          },
        });
    }
  }

  dateFromString(value: string) {
    // Convert UK format date string to Date object
    return DateTime.fromFormat(value, this.datePageFormat, { setZone: true }).toJSDate();
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }
}
