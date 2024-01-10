import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, Input, Output, inject, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { Case } from '@darts-types/index';
import { UserService } from '@services/user/user.service';
import { CaseRetentionPageState } from '@darts-types/case-retention-page-state.type';

@Component({
  selector: 'app-case-retention-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReportingRestrictionComponent,
    RouterLink,
    ValidationErrorSummaryComponent,
  ],
  templateUrl: './case-retention-change.component.html',
  styleUrls: ['./case-retention-change.component.scss'],
})
export class CaseRententionChangeComponent implements AfterViewChecked {
  @Input() state!: CaseRetentionPageState;
  @Input() public caseFile!: Case;

  @Output() stateChange = new EventEmitter<CaseRetentionPageState>();

  private route = inject(ActivatedRoute);
  caseId = this.route.snapshot.params.caseId;
  userService = inject(UserService);
  changeReasonFormControl = new FormControl('');
  retainFormControl = new FormControl('');
  retainDate = new FormControl();
  datePatternValidator = Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/);

  rententionCharacterLimit = 200;
  errors: { fieldId: string; message: string }[] = [];

  get remainingCharacterCount() {
    return this.rententionCharacterLimit - (this.changeReasonFormControl.value?.length || 0);
  }

  setInputValue(value: string) {
    this.retainDate.patchValue(value);
  }

  isDateInvalid(): boolean {
    return !!this.datePatternValidator(this.retainDate);
  }

  onChange() {
    this.errors = [];
  }

  getFieldErrorMessages(fieldName: string): string[] {
    return [];
  }

  onConfirm() {
    this.errors = [];
    if (!this.retainFormControl.value) {
      this.errors.push({
        fieldId: 'radios',
        message: 'You must select an option',
      });
    }
    if (this.retainFormControl.value === 'date' && this.isDateInvalid()) {
      this.errors.push({
        fieldId: 'conditional-reason',
        message: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
      });
    }
    if (!this.changeReasonFormControl.value) {
      this.errors.push({
        fieldId: 'change-reason',
        message: 'You must provide a reason for this change',
      });
    }
    // Move onto confirmation screen
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }

  ngAfterViewChecked(): void {
    initAll();
  }
}
