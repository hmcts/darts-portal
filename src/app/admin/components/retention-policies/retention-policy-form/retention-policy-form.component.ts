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
import { RetentionPolicyFormErrorMessages } from '@constants/retention-policy-form-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { minimumDurationValidator } from '@validators/minimum-duration-validator';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
import { pastDateValidator } from '@validators/past-date.validator';
import { uniqueValidator } from '@validators/retention-policy.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { startWith } from 'rxjs';
import {
  CreatePolicyError,
  RetentionFormContext,
} from '../create-edit-retention-policy/create-edit-retention-policy.component';

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
  @Input() savePolicyError: CreatePolicyError | null = null; // Pass in server side error
  @Output() submitPolicy = new EventEmitter<RetentionPolicyForm>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>(); // emit frontend form validation errors

  form = this.fb.nonNullable.group({
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
  });

  ngOnInit(): void {
    this.setValidators(this.context);

    if (this.context === 'edit') {
      const policy = this.policies.find((p) => p.id == this.policyId) ?? null;

      if (!policy) return;
      // All fields are populated with the existing policy data
      const [years, months, days] = policy.duration.split(/[YMD]/).map(Number).map(String);
      const startDate = policy.policyStartAt.toFormat('dd/MM/yyyy');
      const hours = policy.policyStartAt.hour.toString();
      const minutes = policy.policyStartAt.minute.toString();

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When @Input() savePolicyError changes, set the form error
    // i.e when the server returns a 400, hightlight the offending form control
    if (changes.savePolicyError) {
      this.setFormError(this.savePolicyError!);
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

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(startWith(null))
      .subscribe(() => {
        this.emitFormErrorSummary();
      });

    if (this.form.valid) {
      this.submitPolicy.emit(this.form.value as RetentionPolicyForm);
      return;
    }
  }

  private setValidators(context: RetentionFormContext) {
    const policies = context === 'create' ? this.policies : this.policies.filter((p) => p.id != this.policyId);

    this.form.controls.displayName.addValidators(uniqueValidator(policies, 'displayName'));
    this.form.controls.name.addValidators(uniqueValidator(policies, 'name'));
    this.form.controls.fixedPolicyKey.addValidators(uniqueValidator(policies, 'fixedPolicyKey'));
    this.form.updateValueAndValidity();
  }

  private setFormError(error: CreatePolicyError) {
    if (error === 'NON_UNIQUE_POLICY_NAME') {
      this.form.controls.name.setErrors({ unique: true });
    }
    if (error === 'NON_UNIQUE_POLICY_DISPLAY_NAME') {
      this.form.controls.displayName.setErrors({ unique: true });
    }
    if (error === 'NON_UNIQUE_FIXED_POLICY_KEY') {
      this.form.controls.fixedPolicyKey.setErrors({ unique: true });
    }
    this.form.updateValueAndValidity();
  }

  private emitFormErrorSummary() {
    this.errors.emit(this.formService.getErrorSummary(this.form, RetentionPolicyFormErrorMessages));
  }
}
