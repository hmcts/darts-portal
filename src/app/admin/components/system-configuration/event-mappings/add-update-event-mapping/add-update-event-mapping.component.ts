import { EventMappingFormValues } from '@admin-types/event-mappings/event-mapping-form-values.interface';
import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { EventMappingFormErrorMessages } from '@constants/event-mapping-error-messages';
import { ErrorMessage } from '@core-types/index';
import { ErrorMessageService } from '@services/error/error-message.service';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { FormService } from '@services/form/form.service';
import { HeaderService } from '@services/header/header.service';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
import { Subscription, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-add-update-event-mapping',
  standalone: true,
  templateUrl: './add-update-event-mapping.component.html',
  styleUrl: './add-update-event-mapping.component.scss',
  imports: [ReactiveFormsModule, GovukHeadingComponent, CommonModule, ValidationErrorSummaryComponent],
})
export class AddUpdateEventMappingComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  router = inject(Router);
  headerService = inject(HeaderService);
  eventMappingsService = inject(EventMappingsService);
  formService = inject(FormService);
  errorMessageService = inject(ErrorMessageService);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);

  private mappingTypes: Partial<EventMapping[]> = [];

  eventMappingsPath = 'admin/system-configuration/event-mappings';

  eventHandlers$ = this.eventMappingsService.getEventHandlers();
  eventMappings$ = this.eventMappingsService
    .getEventMappings()
    .pipe(map((eventMappings) => this.assignTypes(eventMappings)));

  error$ = this.errorMessageService.errorMessage$;

  data$ = combineLatest({
    eventHandlers: this.eventHandlers$,
    eventMappings: this.eventMappings$,
  });

  isSubmitted = false;
  isRevision = false;
  context: 'create' | 'edit' = 'create';

  errorSubscription: Subscription | null = null;

  form = this.fb.nonNullable.group({
    type: ['', [Validators.required, optionalMaxLengthValidator(255)]],
    subType: ['', [optionalMaxLengthValidator(255)]],
    eventName: ['', [Validators.required, optionalMaxLengthValidator(255)]],
    eventHandler: ['', [Validators.required]],
    withRestrictions: [false, [Validators.required]],
  });

  onSubmit() {
    this.errorMessageService.clearErrorMessage();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.eventMappingsService.createEventMapping(this.form.value as EventMappingFormValues).subscribe(() => {
        this.router.navigate([this.eventMappingsPath], { queryParams: { newEventMapping: true } });
      });
    }

    if (this.isSubmitted) return; // prevent multiple subscriptions

    this.getErrorSummary();
    this.isSubmitted = true;
  }

  onCancel() {
    this.router.navigate([this.eventMappingsPath]);
  }

  ngOnInit(): void {
    this.headerService.hideNavigation();
    this.setUniqueTypeValidation();

    this.errorSubscription = this.error$.subscribe((error) => {
      this.setResponseErrors(error);
    });
  }

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  private setUniqueTypeValidation() {
    const typeControl = this.form.get('type')!;
    typeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.isNewTypeSubTypeUnique(this.form.controls.type.value, this.form.controls.subType.value)) {
        this.setTypeErrors();
      } else {
        this.form.controls.subType.setErrors(null);
        this.form.controls.type.setErrors(null);
      }
    });

    const subTypeControl = this.form.controls.subType;
    subTypeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.isNewTypeSubTypeUnique(this.form.controls.type.value, this.form.controls.subType.value)) {
        this.setTypeErrors();
      } else {
        this.form.controls.subType.setErrors(null);
        this.form.controls.type.setErrors(null);
      }
    });
  }

  private isNewTypeSubTypeUnique(newType: string, newSubType: string) {
    const seen = new Set();

    for (const mapping of this.mappingTypes) {
      const combo = `${mapping?.type}-${mapping?.subType}`;
      seen.add(combo);
    }

    const newCombo = `${newType}-${newSubType}`;
    return !seen.has(newCombo);
  }

  getErrorMessages(controlKey: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, EventMappingFormErrorMessages);
  }

  isControlInvalid(control: string) {
    return this.form.get(control)?.invalid && this.form.get(control)?.touched;
  }

  getErrorSummary() {
    return this.formService.getUniqueErrorSummary(this.form, EventMappingFormErrorMessages);
  }

  setResponseErrors(error: ErrorMessage | null) {
    if (!this.isRevision && error?.status === 409) {
      // Type and subtype combination must be unique
      this.setTypeErrors();
    }

    if (this.isRevision && error?.status === 409) {
      // Mapping has no prior revision
      // TBD as part of Edit ticket
    }
  }

  private setTypeErrors() {
    this.form.controls.type.setErrors({ unique: true });
    this.form.controls.subType.setErrors({ unique: true });
  }

  private assignTypes(eventMappings: EventMapping[]) {
    const types = eventMappings.map(({ type, subType }) => ({ type, subType })) as Partial<EventMapping[]>;
    this.mappingTypes = types;

    return eventMappings;
  }
}
