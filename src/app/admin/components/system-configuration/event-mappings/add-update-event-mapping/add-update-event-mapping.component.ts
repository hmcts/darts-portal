import { EventMappingFormValues } from '@admin-types/event-mappings/event-mapping-form-values.interface';
import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { EventMappingFormErrorMessages } from '@constants/event-mapping-error-messages';
import { ErrorMessage } from '@core-types/index';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { ErrorMessageService } from '@services/error/error-message.service';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { FormService } from '@services/form/form.service';
import { HeaderService } from '@services/header/header.service';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';
import { Subscription, combineLatest, map, tap } from 'rxjs';

@Component({
  selector: 'app-add-update-event-mapping',
  standalone: true,
  templateUrl: './add-update-event-mapping.component.html',
  styleUrl: './add-update-event-mapping.component.scss',
  imports: [
    ReactiveFormsModule,
    GovukHeadingComponent,
    CommonModule,
    ValidationErrorSummaryComponent,
    LoadingComponent,
    LuxonDatePipe,
  ],
})
export class AddUpdateEventMappingComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  headerService = inject(HeaderService);
  eventMappingsService = inject(EventMappingsService);
  formService = inject(FormService);
  errorMessageService = inject(ErrorMessageService);
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);

  private mappingTypes: Partial<EventMapping[]> = [];

  isSubmitted = false;
  isRevision = this.router.url.includes('/edit') || false;
  id = +this.route.snapshot.params.id;

  eventMappingsPath = 'admin/system-configuration/event-mappings';

  eventHandlers$ = this.eventMappingsService.getEventHandlers();
  eventMappings$ = this.eventMappingsService.getEventMappings().pipe(
    tap((eventMappings) => this.setEventMapping(eventMappings)),
    map((eventMappings) => this.assignTypes(eventMappings))
  );

  error$ = this.errorMessageService.errorMessage$;

  eventMapping: EventMapping | null = null;

  data$ = combineLatest({
    eventHandlers: this.eventHandlers$,
    eventMappings: this.eventMappings$,
  });

  errorSubscription: Subscription | null = null;

  form = this.fb.nonNullable.group({
    type: ['', [Validators.required, optionalMaxLengthValidator(255)]],
    subType: ['', [optionalMaxLengthValidator(255)]],
    eventName: ['', [Validators.required, optionalMaxLengthValidator(255)]],
    eventHandler: ['', [Validators.required]],
    withRestrictions: [false, [Validators.required]],
  });

  //Sets event mapping object if this is a revision
  private setEventMapping(eventMappings: EventMapping[]) {
    if (this.id) {
      this.eventMapping = eventMappings.find((eventMapping) => eventMapping.id === this.id)!;
      this.setDefaultValues();
    }
  }

  private setDefaultValues() {
    if (this.isRevision && this.eventMapping) {
      this.form.controls.type.setValue(this.eventMapping.type);
      this.form.controls.subType.setValue(this.eventMapping.subType);
      this.form.controls.eventName.setValue(this.eventMapping.name);
      this.form.controls.eventHandler.setValue(this.eventMapping.handler);
      this.form.controls.withRestrictions.setValue(this.eventMapping.hasRestrictions);
    }
  }

  ngOnInit(): void {
    this.headerService.hideNavigation();
    this.setUniqueTypeValidation();

    this.errorSubscription = this.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((error) => {
      this.setResponseErrors(error);
    });
  }

  onSubmit() {
    this.errorMessageService.clearErrorMessage();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formValues = this.form.value as EventMappingFormValues;
      if (this.isRevision) formValues.id = this.eventMapping?.id;

      this.eventMappingsService.createEventMapping(formValues, this.isRevision).subscribe(() => {
        const queryParams = this.isRevision ? { isRevision: true } : { newEventMapping: true };

        this.router.navigate([this.eventMappingsPath], {
          queryParams: queryParams,
        });
      });
    }

    if (this.isSubmitted) return; // prevent multiple subscriptions

    this.getErrorSummary();
    this.isSubmitted = true;
  }

  onCancel() {
    this.router.navigate([this.eventMappingsPath]);
  }

  deleteEventMapping() {
    //
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
