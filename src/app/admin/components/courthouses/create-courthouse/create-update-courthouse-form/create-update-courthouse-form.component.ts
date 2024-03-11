import { DataTableComponent } from '@common/data-table/data-table.component';
import { Region } from '@admin-types/courthouses/region.interface';
import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { SecurityGroup } from '@admin-types/users/security-group.type';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { FormService } from '@services/form/form.service';
import {
  courthouseNameExistsValidator,
  displayNameExistsValidator,
  valueIsUndefined,
} from '@validators/courthouse.validator';

const controlErrors: FieldErrors = {
  courthouseName: {
    required: 'Enter a courthouse code',
    courthouseNameExists: 'The courthouse code you entered exists already',
  },
  displayName: {
    required: 'Enter a display name',
    displayNameExists: 'The display name you entered exists already',
  },
  regionId: {
    required: 'Select a region',
  },
};

@Component({
  selector: 'app-create-update-courthouse-form',
  standalone: true,
  imports: [ReactiveFormsModule, DataTableComponent],
  templateUrl: './create-update-courthouse-form.component.html',
  styleUrl: './create-update-courthouse-form.component.scss',
})
export class CreateUpdateCourthouseFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<CreateUpdateCourthouseFormValues>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  @Input() updateCourthouse: CreateUpdateCourthouseFormValues | null = null;
  @Input() regions!: Region[];
  @Input() companies!: SecurityGroup[];

  selectedCompanies: SecurityGroup[] = [];
  selectedCompany: SecurityGroup | undefined = undefined;

  nameExistsValidator = courthouseNameExistsValidator();
  displayNameExistsValidator = displayNameExistsValidator();
  valueIsUndefined = valueIsUndefined();
  courthouseService = inject(CourthouseService);

  fb = inject(FormBuilder);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  formDefaultValues: CreateUpdateCourthouseFormValues = {
    courthouseName: null,
    displayName: null,
    regionId: null,
    securityGroupIds: [],
  };

  form = this.fb.group({
    courthouseName: [this.formDefaultValues.courthouseName, [Validators.required], [this.nameExistsValidator]],
    displayName: [this.formDefaultValues.displayName, [Validators.required], [this.displayNameExistsValidator]],
    regionId: [this.formDefaultValues.regionId, [this.valueIsUndefined]],
    securityGroupIds: [this.formDefaultValues.securityGroupIds],
  });

  ngOnInit(): void {
    if (this.updateCourthouse) {
      this.form.setValue({
        courthouseName: this.updateCourthouse.courthouseName,
        displayName: this.updateCourthouse.displayName,
        regionId: this.updateCourthouse?.regionId?.toString() || '',
        securityGroupIds: this.updateCourthouse?.securityGroupIds,
      });

      this.form.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();

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

  onCancel() {
    this.cancel.emit();
  }

  getFormControlErrorMessages(controlName: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlName, controlErrors);
  }

  isControlInvalid(control: AbstractControl) {
    return control.errors && control.touched;
  }

  selectCompany(id: string | undefined) {
    if (id) {
      const company = this.companies.find((company) => company.id === parseInt(id));
      this.selectedCompany = company;
    }
  }

  addCompany() {
    if (this.selectedCompany) {
      const exists = this.selectedCompanies.find((company) => company.id === this.selectedCompany?.id);
      if (!exists) {
        (this.securityGroupsControl as FormArray).value.push(this.selectedCompany.id.toString());
        this.selectedCompanies.push(this.selectedCompany);
      }
    }
  }

  removeCompany(id: number) {
    const removeCompanyIndex = this.selectedCompanies.findIndex((company) => company.id === id);
    if (removeCompanyIndex >= 0) {
      this.securityGroupsControl.patchValue([]);
      this.selectedCompanies.splice(removeCompanyIndex, 1);
    }
  }

  get courthouseNameControl() {
    return this.form.get('courthouseName')!;
  }

  get displayNameControl() {
    return this.form.get('displayName')!;
  }

  get regionControl() {
    return this.form.get('regionId')!;
  }

  get securityGroupsControl() {
    return this.form.get('securityGroupIds')!;
  }
}
