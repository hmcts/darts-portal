import { EventMappingFormValues } from '@admin-types/event-mappings/event-mapping-form-values.interface';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { HeaderService } from '@services/header/header.service';
import { optionalMaxLengthValidator } from '@validators/optional-maxlength.validator';

@Component({
  selector: 'app-add-update-event-mapping',
  standalone: true,
  templateUrl: './add-update-event-mapping.component.html',
  styleUrl: './add-update-event-mapping.component.scss',
  imports: [ReactiveFormsModule, GovukHeadingComponent, CommonModule],
})
export class AddUpdateEventMappingComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  headerService = inject(HeaderService);
  eventMappingsService = inject(EventMappingsService);

  isRevision = false;
  eventMappingsPath = 'admin/system-configuration/event-mappings';
  eventHandlers$ = this.eventMappingsService.getEventHandlers();

  form = this.fb.nonNullable.group({
    type: ['', [Validators.required, optionalMaxLengthValidator(255)]],
    subType: ['', [optionalMaxLengthValidator(255)]],
    eventName: ['', [Validators.required, optionalMaxLengthValidator(255)]],
    eventHandler: ['', [Validators.required]],
    withRestrictions: [false, [Validators.required]],
  });

  onSubmit() {
    if (this.form.status === 'VALID') {
      this.eventMappingsService.createEventMapping(this.form.value as EventMappingFormValues).subscribe(() => {
        this.router.navigate([this.eventMappingsPath], { queryParams: { newEventMapping: true } });
      });
    }

    console.log(this.form.value);
  }

  onCancel() {
    this.router.navigate([this.eventMappingsPath]);
  }

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
}
