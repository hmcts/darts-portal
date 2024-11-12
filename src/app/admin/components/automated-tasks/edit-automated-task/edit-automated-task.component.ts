import { AutomatedTaskDetails, AutomatedTaskDetailsState } from '@admin-types/automated-task/automated-task';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TimeInputComponent } from '@components/hearing/request-playback-audio/time-input/time-input.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { DateTime } from 'luxon';

type DateKey = 'rpoCsvStartHour' | 'rpoCsvEndHour' | 'armReplayStartTs' | 'armReplayEndTs';

@Component({
  selector: 'app-edit-automated-task',
  standalone: true,
  imports: [
    RouterLink,
    GovukHeadingComponent,
    ReactiveFormsModule,
    ValidationErrorSummaryComponent,
    TimeInputComponent,
    DatepickerComponent,
  ],
  templateUrl: './edit-automated-task.component.html',
  styleUrl: './edit-automated-task.component.scss',
})
export class EditAutomatedTaskComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  automatedTasksService = inject(AutomatedTasksService);
  fb = inject(NonNullableFormBuilder);

  task: AutomatedTaskDetails;
  taskState: AutomatedTaskDetailsState = this.router.getCurrentNavigation()?.extras.state?.automatedTask;
  edit: 'RPO_START_TIME' | 'RPO_END_TIME' | 'ARM_START_TIME' | 'ARM_END_TIME' | 'BATCH_SIZE';
  dateLabel = '';
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

  dateForm = this.fb.group({
    dateInput: ['', [Validators.required]],
    timeInput: this.fb.group({
      hours: ['', [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
      minutes: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      seconds: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
    }),
  });

  isSubmitted = signal(false);

  constructor() {
    this.task = this.parseDateValues(this.taskState);
    this.edit = this.router.getCurrentNavigation()?.extras.state?.edit;

    if (!this.taskState || !this.edit) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      if (this.edit !== 'BATCH_SIZE') {
        this.loadDateValues();
      } else {
        this.batchSizeInput.setValue(this.task.batchSize);
      }
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

    if (this.edit === 'BATCH_SIZE') {
      this.updateBatchSize();
    } else {
      this.updateDateValues();
    }
  }

  private updateBatchSize() {
    this.batchSizeInput.updateValueAndValidity();

    if (this.batchSizeInput.invalid) return;

    this.automatedTasksService
      .changeBatchSize(this.task.id, this.batchSizeInput.value)
      .subscribe(() =>
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { batchSizeChanged: true } })
      );
  }

  private updateDateValues() {
    this.dateForm.updateValueAndValidity();

    if (this.dateForm.invalid) return;

    const date = this.getUTCISODateString();
    if (date) {
      this.automatedTasksService.changeDateTime(this.task.id, this.getServerSideKey()!, date).subscribe(() =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParams: { dateChanged: true, label: this.getDateLabel() },
        })
      );
    }
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

  private loadDateValues() {
    this.dateLabel = this.getDateLabel();
    const dateKey = this.getDateKey();
    let existingDateTime = dateKey ? this.task[dateKey] : null;

    if (existingDateTime && dateKey) {
      const formattedDate = existingDateTime.toFormat('dd/MM/yyyy');
      this.dateForm.patchValue({
        dateInput: formattedDate,
        timeInput: {
          hours: existingDateTime.hour.toString().padStart(2, '0'),
          minutes: existingDateTime.minute.toString().padStart(2, '0'),
          seconds: existingDateTime.second.toString().padStart(2, '0'),
        },
      });
    }
  }

  //Ensures datetime persist on refresh after being passed through state
  private parseDateValues(taskState: AutomatedTaskDetailsState): AutomatedTaskDetails {
    return {
      ...taskState,
      rpoCsvStartHour: taskState.rpoCsvStartHour ? DateTime.fromISO(taskState.rpoCsvStartHour) : undefined,
      rpoCsvEndHour: taskState.rpoCsvEndHour ? DateTime.fromISO(taskState.rpoCsvEndHour) : undefined,
      armReplayStartTs: taskState.armReplayStartTs ? DateTime.fromISO(taskState.armReplayStartTs) : undefined,
      armReplayEndTs: taskState.armReplayEndTs ? DateTime.fromISO(taskState.armReplayEndTs) : undefined,
    };
  }

  private getDateLabel() {
    switch (this.edit) {
      case 'RPO_START_TIME':
        return 'RPO CSV start hour';
      case 'RPO_END_TIME':
        return 'RPO CSV end hour';
      case 'ARM_START_TIME':
        return 'ARM Replay start time';
      case 'ARM_END_TIME':
        return 'ARM Replay end time';
      default:
        return '';
    }
  }

  private getDateKey(): DateKey | null {
    switch (this.edit) {
      case 'RPO_START_TIME':
        return 'rpoCsvStartHour';
      case 'RPO_END_TIME':
        return 'rpoCsvEndHour';
      case 'ARM_START_TIME':
        return 'armReplayStartTs';
      case 'ARM_END_TIME':
        return 'armReplayEndTs';
      default:
        return null;
    }
  }

  private getServerSideKey(): string | null {
    switch (this.edit) {
      case 'RPO_START_TIME':
        return 'rpo_csv_start_hour';
      case 'RPO_END_TIME':
        return 'rpo_csv_end_hour';
      case 'ARM_START_TIME':
        return 'arm_replay_start_ts';
      case 'ARM_END_TIME':
        return 'arm_replay_end_ts';
      default:
        return null;
    }
  }

  private getUTCISODateString(): string | null {
    const dateValue = this.dateForm.get('dateInput')?.value;
    const timeGroup = this.dateForm.get('timeInput')?.value;

    //Assume inputs exist due to form validation
    const [day, month, year] = dateValue!.split('/').map(Number);
    const { hours, minutes, seconds } = timeGroup!;

    const dateTime = DateTime.local(year, month, day, +hours, +minutes, +seconds).toUTC();

    return dateTime.isValid ? dateTime.toISO() : null;
  }
}
