import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { RetentionPolicyErrorCode } from '@constants/retention-policy-error-codes';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CaseService } from '@services/case/case.service';
import { DateTime, Duration } from 'luxon';
import { CaseRetentionPageState } from 'src/app/portal/models/case/case-retention-page-state.type';

@Component({
  selector: 'app-case-retention-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorSummaryComponent,
    GovukTextareaComponent,
    DatepickerComponent,
  ],
  templateUrl: './case-retention-change.component.html',
  styleUrls: ['./case-retention-change.component.scss'],
})
export class CaseRetentionChangeComponent {
  appConfig = inject(AppConfigService);

  @Input() caseId!: number;
  @Input() state!: CaseRetentionPageState;

  @Output() stateChange = new EventEmitter<CaseRetentionPageState>();
  @Output() retentionDateChange = new EventEmitter<Date>();
  @Output() retentionReasonChange = new EventEmitter<string>();
  @Output() retentionPermanentChange = new EventEmitter<boolean>();

  private datePageFormat = 'dd/MM/yyyy';
  private dateApiFormat = 'yyyy-MM-dd';

  retainReasonFormControl = new FormControl('');
  retainOptionFormControl = new FormControl('');
  retainDateFormControl = new FormControl();
  datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);
  caseService = inject(CaseService);

  supportName = this.appConfig.getAppConfig()?.support.name || 'DTS-IT Service Desk';

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

  private validateRetainOption() {
    this.retainOptionFormControl.markAsDirty();
    if (!this.retainOptionFormControl.value) {
      this.setFieldError('change-radios', this.errorNoOption);
    }
  }

  private validateRetainReason() {
    if (!this.retainReasonFormControl.value) {
      this.retainReasonFormControl.markAsDirty();
      this.setFieldError('change-reason', this.errorNoReason);
    }
  }

  private validateRetentionDate() {
    const isPermanent = this.retainOptionFormControl.value !== 'date';
    if (!isPermanent) {
      this.onChangeDate();
      if (this.errorDate) {
        this.setFieldError('retention-date', this.errorDate);
      }
    }
  }

  private setFieldError(fieldId: string, message: string) {
    this.errors.push({ fieldId, message });
  }

  onConfirm() {
    this.errors = [];

    this.validateRetainOption();
    this.validateRetainReason();
    this.validateRetentionDate();

    if (this.errors.length) {
      return;
    }

    const isPermanent = this.retainOptionFormControl.value !== 'date';
    const formattedDate = this.retainDateFormControl.value
      ? DateTime.fromFormat(this.retainDateFormControl.value, this.datePageFormat).toFormat(this.dateApiFormat)
      : undefined;

    if (!this.errors.length) {
      // As long as there's no other errors, make the call
      this.caseService
        .postCaseRetentionDateValidate({
          case_id: this.caseId,
          retention_date: formattedDate,
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
          error: (err) => this.handleRetentionError(err),
        });
    }
  }

  handleRetentionError(err: HttpErrorResponse) {
    const code = err?.error?.type as RetentionPolicyErrorCode | undefined;

    switch (code) {
      case RetentionPolicyErrorCode.RETENTION_DATE_TOO_LATE: {
        const maxDuration = err.error?.max_duration;
        if (maxDuration) {
          const d = maxDuration.match(/\d+/g) || [];
          const duration = Duration.fromObject({
            years: parseInt(d[0]),
            months: parseInt(d[1]) || undefined,
            days: parseInt(d[2]) || undefined,
          });
          this.errorDate = `You cannot retain a case for more than ${duration.toHuman({ listStyle: 'long' })} after the case closed`;
        }
        break;
      }

      case RetentionPolicyErrorCode.RETENTION_DATE_TOO_EARLY: {
        const earliest = err.error?.latest_automated_retention_date;
        if (earliest) {
          const date = DateTime.fromFormat(earliest, this.dateApiFormat, { setZone: true });
          this.errorDate = `You cannot set retention date earlier than ${date.toFormat(this.datePageFormat)}`;
        }
        break;
      }

      case RetentionPolicyErrorCode.NO_PERMISSION_REDUCE_RETENTION: {
        this.errorDate = `You do not have permission to reduce the current retention date.\r\nPlease refer to the DARTS retention policy guidance.`;
        break;
      }

      case RetentionPolicyErrorCode.CASE_NOT_CLOSED: {
        this.errorDate = `The case must be closed before the retention period can be amended.`;
        break;
      }

      case RetentionPolicyErrorCode.NO_RETENTION_POLICIES_APPLIED: {
        this.errorDate = `Changes cannot be made to a retention date before a system retention period has been applied.`;
        break;
      }

      case RetentionPolicyErrorCode.CASE_RETENTION_PASSED: {
        this.errorDate = `This case has expired. It is not possible to make any changes to the retention date.`;
        break;
      }

      default: {
        this.errorDate = `There is a problem with the service. Try again or contact ${this.supportName} if the problem persists`;
        break;
      }
    }

    this.setFieldError('retention-date', this.errorDate);
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }
}
