import { Region } from '@admin-types/courthouses/region.interface';
import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { SecurityGroup } from '@admin-types/users/security-group.type';
import { Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { CourthouseData, ErrorSummaryEntry, FieldErrors } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import {
  courthouseNameExistsValidator,
  displayNameExistsValidator,
  valueIsNull,
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
  constructor(private elementRef: ElementRef<HTMLElement>) {}
  @Output() submitForm = new EventEmitter<CreateUpdateCourthouseFormValues>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  @Input() updateCourthouse: CreateUpdateCourthouseFormValues | null = null;
  @Input() regions!: Region[];
  @Input() companies!: SecurityGroup[];
  @Input() courthouses!: CourthouseData[];
  @Input() hasData: boolean = false;

  selectedCompanies: SecurityGroup[] = [];
  selectedCompany: SecurityGroup | undefined = undefined;

  valueIsNull = valueIsNull();

  fb = inject(FormBuilder);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  formDefaultValues: CreateUpdateCourthouseFormValues = {
    courthouseName: null,
    displayName: null,
    // Set regionId as empty string so "No region" is not selected
    regionId: '',
    securityGroupIds: [],
  };

  form!: FormGroup;

  ngOnInit(): void {
    // Build the form group after init so that we have access to data
    this.form = this.fb.group({
      courthouseName: [
        this.formDefaultValues.courthouseName,
        [Validators.required, courthouseNameExistsValidator(this.courthouses)],
      ],
      displayName: [
        this.formDefaultValues.displayName,
        [Validators.required, displayNameExistsValidator(this.courthouses)],
      ],
      regionId: [this.formDefaultValues.regionId, [this.valueIsNull]],
      securityGroupIds: [this.formDefaultValues.securityGroupIds],
    });
    if (this.updateCourthouse) {
      this.form.setValue({
        courthouseName: this.updateCourthouse.courthouseName,
        displayName: this.updateCourthouse.displayName,
        regionId: this.updateCourthouse?.regionId || null,
        securityGroupIds: this.updateCourthouse?.securityGroupIds,
      });
      if (this.securityGroupsControl.value.length) {
        const selectedCompanies = this.companies.filter((company) =>
          this.securityGroupsControl.value.includes(company.id.toString())
        );
        this.selectedCompanies = selectedCompanies;
      }

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

  formatNameToRadioId(value: string | undefined) {
    return (value?.toLowerCase().replace(' ', '-') || 'no-region') + '-radio';
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
        const securityGroupsCopy = [...this.securityGroupsControl.value];
        securityGroupsCopy.push(this.selectedCompany.id.toString());
        this.securityGroupsControl.setValue(securityGroupsCopy);
        this.selectedCompanies.push(this.selectedCompany);
      }
    }
  }

  removeCompany(id: number) {
    const removeCompany = this.selectedCompanies.find((company) => company.id === id);
    if (removeCompany) {
      const securityGroupsCopy = [...this.securityGroupsControl.value];
      securityGroupsCopy.splice(securityGroupsCopy.indexOf(removeCompany.id.toString()), 1);
      this.securityGroupsControl.setValue(securityGroupsCopy);
      this.selectedCompanies.splice(this.selectedCompanies.indexOf(removeCompany), 1);
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
