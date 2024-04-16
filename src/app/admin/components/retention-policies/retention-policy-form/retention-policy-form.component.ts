import { RetentionPolicy, RetentionPolicyForm } from '@admin-types/index';
import { JsonPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TimeInputComponent } from '@components/hearing/request-playback-audio/time-input/time-input.component';
import { RetentionPolicyErrorCode } from '@constants/retention-policy-error-codes';
import { RetentionPolicyFormErrorMessages } from '@constants/retention-policy-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { minimumDurationValidator } from '@validators/minimum-duration-validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
import { pastDateValidator } from '@validators/past-date.validator';
import { pastDateTimeValidator } from '@validators/past-datetime-validator';
import { uniqueValidator } from '@validators/retention-policy.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { startWith } from 'rxjs';
import { RetentionFormContext } from '../create-edit-retention-policy/create-edit-retention-policy.component';

@Component({
  selector: 'app-retention-policy-form',
  standalone: true,
  imports: [ReactiveFormsModule, GovukHeadingComponent, DatepickerComponent, TimeInputComponent, JsonPipe],
  templateUrl: './retention-policy-form.component.html',
  styleUrl: './retention-policy-form.component.scss',
})
export class RetentionPolicyFormComponent implements OnInit, OnChanges {
  fb = inject(FormBuilder);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  @Input() policyId: number | null = null;
  @Input() context: RetentionFormContext = 'create';
  @Input() policies: RetentionPolicy[] = [];
  @Input() savePolicyError: RetentionPolicyErrorCode | null = null; // Pass in server side error
  @Output() submitPolicy = new EventEmitter<RetentionPolicyForm>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>(); // emit frontend form validation errors

  isSubmitted = false;
  isRevision = false;

  form = this.fb.nonNullable.group(
    {
      displayName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [optionalMaxLengthValidator(255)]],
      fixedPolicyKey: ['', [Validators.required]],
      duration: this.fb.nonNullable.group(
        {
          years: '',
          months: '',
          days: '',
        },
        { validators: minimumDurationValidator }
      ),
      startDate: ['', [Validators.required, pastDateValidator]],
      startTime: this.fb.nonNullable.group(
        {
          hours: ['', [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
          minutes: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        },
        { validators: timeGroupValidator }
      ),
    },
    { validators: pastDateTimeValidator }
  );

  policy: RetentionPolicy | null = null;

  submitButtonText = 'Save';

  ngOnInit(): void {
    this.submitButtonText = this.context.includes('create') ? 'Create' : 'Save';
    this.isRevision = this.context === 'create-revision' || this.context === 'edit-revision';

    this.policy = this.policies.find((p) => p.id == this.policyId) ?? null;

    this.setValidators(this.policies, this.context, this.policy);

    this.policy && this.populateForm(this.policy, this.context);

    this.form.controls.startDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.controls.startTime.setErrors(null);
      this.form.controls.startTime.updateValueAndValidity();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When @Input() savePolicyError changes, set the form error
    // i.e when the server returns a 400, hightlight the offending form control
    if (changes.savePolicyError) {
      setTimeout(() => {
        this.setFormError(this.savePolicyError!);
      }, 0);
    }
  }

  getErrorMessages(controlKey: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, RetentionPolicyFormErrorMessages);
  }

  isControlInvalid(control: string) {
    return this.form.get(control)?.invalid && this.form.get(control)?.touched;
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.submitPolicy.emit(this.form.value as RetentionPolicyForm);
      return;
    }

    // Set custom error for same day but past time
    if (this.form.errors?.pastDateTime) {
      this.form.controls.startTime.setErrors({ pastDateTime: true });
    }

    if (this.isSubmitted) return; // prevent multiple subscriptions

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(startWith(null))
      .subscribe(() => {
        this.emitFormErrorSummary();
      });

    this.isSubmitted = true;
  }

  populateForm(policy: RetentionPolicy, context: RetentionFormContext) {
    // No need to prefill form for create context
    if (context === 'create' || !policy) return;

    // Prefill all fields for edit context
    if (context === 'edit' || context === 'edit-revision') {
      const [years, months, days] = policy.duration.split(/[YMD]/).map(Number).map(String);
      const startDate = policy.policyStartAt.toFormat('dd/MM/yyyy');
      const hours = policy.policyStartAt.hour.toString().padStart(2, '0');
      const minutes = policy.policyStartAt.minute.toString().padStart(2, '0');

      this.form.patchValue({
        displayName: policy.displayName,
        name: policy.name,
        description: policy.description,
        fixedPolicyKey: policy.fixedPolicyKey,
        duration: {
          years,
          months,
          days,
        },
        startDate,
        startTime: {
          hours,
          minutes,
        },
      });
    }

    // Prefill only the necessary fields for create-revision context
    if (context === 'create-revision') {
      this.form.patchValue({
        displayName: policy.displayName,
        name: policy.name,
        description: policy.description,
        fixedPolicyKey: policy.fixedPolicyKey,
      });
    }
  }

  // Set validators for unique fields: displayName, name, fixedPolicyKey
  private setValidators(policies: RetentionPolicy[], context: RetentionFormContext, policy: RetentionPolicy | null) {
    if (context === 'edit') {
      // remove the current policy from the list to allow for same name, displayName, fixedPolicyKey
      policies = policies.filter((p) => p.id != policy?.id);
    }

    if (context === 'create-revision' || context === 'edit-revision') {
      // remove other revisions of the same policy to allow for same name, displayName, fixedPolicyKey
      policies = policies.filter((p) => p.fixedPolicyKey !== policy?.fixedPolicyKey);
    }

    this.form.controls.displayName.addValidators(uniqueValidator(policies, 'displayName'));
    this.form.controls.name.addValidators(uniqueValidator(policies, 'name'));
    this.form.controls.fixedPolicyKey.addValidators(uniqueValidator(policies, 'fixedPolicyKey'));
    this.form.updateValueAndValidity();
  }

  private setFormError(error: RetentionPolicyErrorCode) {
    if (error === RetentionPolicyErrorCode.NON_UNIQUE_POLICY_NAME) {
      this.form.controls.name.setErrors({ unique: true });
    }
    if (error === RetentionPolicyErrorCode.NON_UNIQUE_POLICY_DISPLAY_NAME) {
      this.form.controls.displayName.setErrors({ unique: true });
    }
    if (error === RetentionPolicyErrorCode.NON_UNIQUE_FIXED_POLICY_KEY) {
      this.form.controls.fixedPolicyKey.setErrors({ unique: true });
    }
    if (error === RetentionPolicyErrorCode.POLICY_START_MUST_BE_FUTURE) {
      this.form.controls.startDate.setErrors({ pastDate: true });
      this.form.controls.startTime.setErrors({ pastDateTime: true });
    }
    if (error === RetentionPolicyErrorCode.POLICY_START_DATE_MUST_BE_PAST) {
      this.form.controls.startDate.setErrors({ priorRevisionDate: true });
    }
    this.form.updateValueAndValidity();
  }

  private emitFormErrorSummary() {
    this.errors.emit(this.formService.getErrorSummary(this.form, RetentionPolicyFormErrorMessages));
  }
}
