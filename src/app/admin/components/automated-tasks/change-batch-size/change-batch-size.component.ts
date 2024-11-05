import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';

@Component({
  selector: 'app-change-batch-size',
  standalone: true,
  imports: [RouterLink, GovukHeadingComponent, ReactiveFormsModule, ValidationErrorSummaryComponent],
  templateUrl: './change-batch-size.component.html',
  styleUrl: './change-batch-size.component.scss',
})
export class ChangeBatchSizeComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  automatedTasksService = inject(AutomatedTasksService);
  fb = inject(NonNullableFormBuilder);

  task: AutomatedTaskDetails;
  validationErrorSummary: ErrorSummaryEntry[] = [];

  readonly maxBatchSize = 2147483647;
  readonly requiredErrorMessage = 'Batch size must be set';
  readonly minimumErrorMessage = 'Batch size must be greater than 0';
  readonly nonIntegerErrorMessage = 'Batch size must be an integer';
  readonly maximumErrorMessage = `Batch size must be less than ${this.maxBatchSize}`;

  batchSizeInput = this.fb.control(0, [
    Validators.required,
    Validators.min(1),
    Validators.max(this.maxBatchSize),
    Validators.pattern(/^-?\d+$/),
  ]);
  isSubmitted = signal(false);

  constructor() {
    this.task = this.router.getCurrentNavigation()?.extras.state?.task;

    if (this.task) {
      this.batchSizeInput.setValue(this.task.batchSize);
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }

    this.batchSizeInput.events.pipe(takeUntilDestroyed()).subscribe(({ source }) => {
      if (source.errors && this.isSubmitted()) {
        this.validationErrorSummary = this.getErrorSummary(source.errors);
      } else {
        this.validationErrorSummary = [];
      }
    });
  }

  onSubmit() {
    this.isSubmitted.set(true);
    this.batchSizeInput.updateValueAndValidity();

    if (this.batchSizeInput.invalid) return;

    this.automatedTasksService
      .changeBatchSize(this.task.id, this.batchSizeInput.value)
      .subscribe(() =>
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { batchSizeChanged: true } })
      );
  }

  getErrorSummary(errors: ValidationErrors): ErrorSummaryEntry[] {
    const summary = [];

    if (errors?.required) {
      summary.push({ message: this.requiredErrorMessage, fieldId: 'batch-size' });
    }

    if (errors?.min) {
      summary.push({ message: this.minimumErrorMessage, fieldId: 'batch-size' });
    }

    if (errors?.max) {
      summary.push({ message: this.maximumErrorMessage, fieldId: 'batch-size' });
    }

    if (errors?.pattern) {
      summary.push({ message: this.nonIntegerErrorMessage, fieldId: 'batch-size' });
    }

    return summary;
  }
}
