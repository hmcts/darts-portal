import { AutomatedTask, AutomatedTaskDetailsState } from '@admin-types/automated-task/automated-task';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { AutomatedTaskEditFormErrorMessages } from '@constants/automated-task-edit-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { FormService } from '@services/form/form.service';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { DatatableColumn } from '@core-types/index';
import { CronExecution } from '@admin-types/automated-task/automated-task';
import { LoadingComponent } from '@common/loading/loading.component';

@Component({
  selector: 'app-edit-cron-expression',
  standalone: true,
  imports: [
    RouterLink,
    GovukHeadingComponent,
    ReactiveFormsModule,
    ValidationErrorSummaryComponent,
    GovukTagComponent,
    DataTableComponent,
    TableRowTemplateDirective,
    LoadingComponent,
  ],
  templateUrl: './edit-cron-expression.component.html',
  styleUrl: './edit-cron-expression.component.scss',
})
export class EditCronExpressionComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  automatedTasksService = inject(AutomatedTasksService);
  fb = inject(NonNullableFormBuilder);
  formService = inject(FormService);

  task!: AutomatedTask;
  taskState: AutomatedTaskDetailsState = this.router.currentNavigation()?.extras.state?.automatedTask;
  validationErrorSummary: ErrorSummaryEntry[] = [];
  form!: FormGroup;

  isContinued = signal(false);
  isPreviewMode = signal(false);
  isPreviewLoaded = signal(false);
  hasPreviewErrored = signal(false);
  cronExecutions: CronExecution[] = [];

  columns: DatatableColumn[] = [
    { name: 'Execution number', prop: 'executionNumber' },
    { name: 'Scheduled at', prop: 'scheduledAt' },
  ];

  constructor() {
    if (!this.taskState) {
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    this.task = { ...this.taskState };
    this.setupFormControls();
    this.loadInputValue();
  }

  private setupFormControls() {
    this.form = this.fb.group({ cronExpression: ['', [Validators.required]] });
  }

  private loadInputValue() {
    this.cronControl.setValue(this.task.cronExpression);

    this.cronControl?.events.pipe(takeUntilDestroyed()).subscribe(({ source }) => {
      if (source.errors && this.isContinued()) {
        this.validationErrorSummary = this.getErrorSummary();
      } else {
        this.validationErrorSummary = [];
      }
    });
  }

  get cronControl() {
    return this.form.controls.cronExpression;
  }

  onContinue() {
    this.form.markAllAsTouched();
    this.isContinued.set(true);
    this.form.updateValueAndValidity();
    this.validationErrorSummary = this.getErrorSummary();

    if (this.cronControl.valid) {
      this.isPreviewMode.set(true);
      this.automatedTasksService.getNextCronExecutionTimes(this.task.id, this.cronControl.value).subscribe({
        next: (response) => {
          this.cronExecutions = response;
          this.isPreviewLoaded.set(true);
        },
        error: (error) => {
          this.validationErrorSummary = [
            {
              fieldId: 'cronExpression',
              message:
                error.status === 400
                  ? 'Invalid cron expression'
                  : 'An unexpected error occurred while generating the preview. Please try again later.',
            },
          ];
          this.hasPreviewErrored.set(true);
        },
      });
    }
  }

  onSubmit() {
    if (this.cronControl.invalid) return;

    const formValue = this.cronControl.value;
    this.automatedTasksService.changeCronExpression(this.task.id, formValue).subscribe(() =>
      this.router.navigate(['../'], {
        relativeTo: this.route,
        queryParams: { labelChanged: 'Cron expression' },
      })
    );
  }

  isControlInvalid() {
    return this.cronControl.invalid && this.cronControl.touched;
  }

  getErrorSummary(): ErrorSummaryEntry[] {
    return this.formService.getErrorSummary(this.form, AutomatedTaskEditFormErrorMessages);
  }

  getErrorMessages(): string[] {
    return this.formService.getFormControlErrorMessages(
      this.form,
      'cronExpression',
      AutomatedTaskEditFormErrorMessages
    );
  }
}
