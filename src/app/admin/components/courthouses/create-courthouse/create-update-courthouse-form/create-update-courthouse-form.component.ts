import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '@common/loading/loading.component';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { FormService } from '@services/form/form.service';
import { courthouseNameExistsValidator, displayNameExistsValidator } from '@validators/courthourtName-exists.validator';
import { combineLatest } from 'rxjs';

const controlErrors: FieldErrors = {
  courthouseName: {
    required: 'Enter a courthouse code',
    courthouseNameExists: 'The courthouse code you entered exists already',
  },
  displayName: {
    required: 'Enter a display name',
    displayNameExists: 'The display name you entered exists already',
  },
  region: {
    required: 'Select a region',
  },
};

@Component({
  selector: 'app-create-update-courthouse-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: './create-update-courthouse-form.component.html',
  styleUrl: './create-update-courthouse-form.component.scss',
})
export class CreateUpdateCourthouseFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<CreateUpdateCourthouseFormValues>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  @Input() updateCourthouse: CreateUpdateCourthouseFormValues | null = null;

  formDefaultValues: CreateUpdateCourthouseFormValues = { courthouseName: null, displayName: null, region: null };
  nameExistsValidator = courthouseNameExistsValidator();
  displayNameExistsValidator = displayNameExistsValidator();
  courthouseService = inject(CourthouseService);
  regions$ = this.courthouseService.getCourthouseRegions();

  fb = inject(FormBuilder);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  form = this.fb.group({
    courthouseName: [this.formDefaultValues.courthouseName, [Validators.required], [this.nameExistsValidator]],
    displayName: [this.formDefaultValues.displayName, [Validators.required], [this.displayNameExistsValidator]],
    region: [this.formDefaultValues.region, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.updateCourthouse) {
      this.form.setValue({
        courthouseName: this.updateCourthouse.courthouseName,
        displayName: this.updateCourthouse.displayName,
        region: this.updateCourthouse.region ?? null,
      });

      this.setCourthouseNameUpdateValidation();

      this.form.updateValueAndValidity();
    }
  }

  private setCourthouseNameUpdateValidation() {
    const courthouseNameControl = this.form.get('courthouseName')!;

    courthouseNameControl.setAsyncValidators([]);

    courthouseNameControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newCourthouseName) => {
      if (newCourthouseName === this.updateCourthouse?.courthouseName) {
        // Remove the email exists validator for email if we are updating a courthouse and the email has not changed
        courthouseNameControl.setAsyncValidators([]);
      } else {
        // Add the email exists validator for email if we are updating a courthouse and the email has changed
        courthouseNameControl.setAsyncValidators([this.nameExistsValidator]);
      }
      this.displayNameControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();

    // wait for async validation to complete
    if (this.form.status === 'PENDING') {
      return;
    }

    if (this.form.invalid) {
      this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.errors.emit(this.formService.getErrorSummary(this.form, controlErrors));
      });
      this.form.updateValueAndValidity();
      return;
    }

    this.errors.emit([]);
    this.submitForm.emit(this.form.value as CreateUpdateCourthouseFormValues);
  }

  formatNameToId(value: string) {
    return value.toLowerCase().replace(' ', '-');
  }

  onChangeRegion(value: string | null) {
    this.form.patchValue({ region: value });
  }

  onCancel() {
    this.cancel.emit();
  }

  getFormControlErrorMessages(controlName: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlName, controlErrors);
  }

  isControlInvalid(control: AbstractControl) {
    return control.errors && control.touched;
  }

  vm$ = combineLatest({
    regions: this.regions$,
  });

  get courthouseNameControl() {
    return this.form.get('courthouseName')!;
  }

  get displayNameControl() {
    return this.form.get('displayName')!;
  }

  get regionControl() {
    return this.form.get('region')!;
  }
}
