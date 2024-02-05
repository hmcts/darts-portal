import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { UserService } from '@services/user/user.service';
import { beforeDateValidator } from '@validators/before-date.validator';
import { DateTime } from 'luxon';
import { CaseRetentionPageState } from 'src/app/portal/models/case/case-retention-page-state.type';

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
  @Input() state!: CaseRetentionPageState;
  @Input() currentRetentionDate!: string | null;
  @Input() originalRetentionDate!: string | null;

  @Output() stateChange = new EventEmitter<CaseRetentionPageState>();
  @Output() retentionDateChange = new EventEmitter<Date>();
  @Output() retentionReasonChange = new EventEmitter<string>();
  @Output() retentionPermanentChange = new EventEmitter<boolean>();

  userService = inject(UserService);
  retainReasonFormControl = new FormControl('');
  retainOptionFormControl = new FormControl('');
  retainDateFormControl = new FormControl();
  datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);
  datePipe = inject(DatePipe);

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
    if (
      !this.userService.hasRoles(['ADMIN', 'JUDGE']) &&
      beforeDateValidator(this.retainDateFormControl, this.currentRetentionDate)
    ) {
      this.errorDate =
        'You do not have permission to reduce the current retention date. Please refer to the DARTS retention policy guidance';
    } else if (beforeDateValidator(this.retainDateFormControl, this.originalRetentionDate)) {
      this.errorDate = `You cannot set retention date earlier than ${this.originalRetentionDate}`;
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
    if (!this.retainOptionFormControl.value) {
      this.errors.push({
        fieldId: 'change-radios',
        message: this.errorNoOption,
      });
    }
    if (this.retainOptionFormControl.value === 'date') {
      this.onChangeDate();
      if (this.errorDate) {
        this.errors.push({
          fieldId: 'retention-date',
          message: this.errorDate,
        });
      }
    } else {
      // Permanent - Add 99 years to today's date
      const date = DateTime.now().plus({ years: 99 });
      this.retainDateFormControl.setValue(date.toFormat('dd/MM/yyyy'));
    }
    if (!this.retainReasonFormControl.value) {
      this.retainReasonFormControl.markAsDirty();
      this.errors.push({
        fieldId: 'change-reason',
        message: this.errorNoReason,
      });
    }
    if (!this.errors.length) {
      this.retentionDateChange.emit(this.dateFromString(this.retainDateFormControl.value));
      this.retentionReasonChange.emit(this.retainReasonFormControl.value || '');
      this.retentionPermanentChange.emit(!(this.retainOptionFormControl.value === 'date'));
      this.stateChange.emit('Confirm');
    }
  }

  dateFromString(value: string) {
    // Convert UK format date string to Date object
    return DateTime.fromFormat(value, 'dd/MM/yyyy', { setZone: true }).toJSDate();
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }
}