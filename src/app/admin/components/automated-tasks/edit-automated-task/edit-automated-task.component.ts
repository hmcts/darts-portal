import { AutomatedTaskDetails, AutomatedTaskDetailsState } from '@admin-types/automated-task/automated-task';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TimeInputComponent } from '@components/hearing/request-playback-audio/time-input/time-input.component';
import { AutomatedTaskEditFormErrorMessages, maxBatchSize } from '@constants/automated-task-edit-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { FormService } from '@services/form/form.service';
import { realDateValidator } from '@validators/real-date.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { DateTime } from 'luxon';

export const dateValidators = [
  Validators.required,
  Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  realDateValidator,
];

const datePropertyMap = {
  RPO_START_TIME: { label: 'RPO CSV start hour', key: 'rpoCsvStartHour', api_key: 'rpo_csv_start_hour' },
  RPO_END_TIME: { label: 'RPO CSV end hour', key: 'rpoCsvEndHour', api_key: 'rpo_csv_end_hour' },
  ARM_START_TIME: { label: 'ARM Replay start time', key: 'armReplayStartTs', api_key: 'arm_replay_start_ts' },
  ARM_END_TIME: { label: 'ARM Replay end time', key: 'armReplayEndTs', api_key: 'arm_replay_end_ts' },
};

type DatePropertyMap = typeof datePropertyMap;
type DateKey = DatePropertyMap[keyof DatePropertyMap]['key'];
type EditType = keyof typeof datePropertyMap | 'BATCH_SIZE';

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
  formService = inject(FormService);

  task: AutomatedTaskDetails;
  taskState: AutomatedTaskDetailsState = this.router.getCurrentNavigation()?.extras.state?.automatedTask;
  edit: EditType;
  dateLabel = '';
  validationErrorSummary: ErrorSummaryEntry[] = [];

  form = this.fb.group({
    batchSize: this.fb.control(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(maxBatchSize),
      Validators.pattern(/^-?\d+$/),
    ]),
    date: ['', dateValidators],
    time: this.fb.group(
      {
        hours: ['', [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      },
      { validators: timeGroupValidator }
    ),
  });

  isSubmitted = signal(false);

  constructor() {
    this.task = this.parseDateValues(this.taskState);
    this.edit = this.router.getCurrentNavigation()?.extras.state?.edit;

    if (!this.taskState || !this.edit) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      if (this.isDateTimeEdit()) {
        (this.form as FormGroup).removeControl('batchSize');
        this.loadDateValues();

        this.form.controls.date.events.pipe(takeUntilDestroyed()).subscribe(({ source }) => {
          if (source.errors && this.isSubmitted()) {
            this.validationErrorSummary = this.getErrorSummary();
          } else {
            this.validationErrorSummary = [];
          }
        });

        this.form.controls.time.events.pipe(takeUntilDestroyed()).subscribe(({ source }) => {
          if (source.errors && this.isSubmitted()) {
            this.validationErrorSummary = this.getErrorSummary();
          } else {
            this.validationErrorSummary = [];
          }
        });
      } else if (this.edit === 'BATCH_SIZE') {
        (this.form as FormGroup).removeControl('date');
        (this.form as FormGroup).removeControl('time');
        this.form.controls.batchSize.setValue(this.task.batchSize);

        this.form.controls.batchSize.events.pipe(takeUntilDestroyed()).subscribe(({ source }) => {
          if (source.errors && this.isSubmitted()) {
            this.validationErrorSummary = this.getErrorSummary();
          } else {
            this.validationErrorSummary = [];
          }
        });
      }
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.isSubmitted.set(true);
    this.form.updateValueAndValidity();
    this.validationErrorSummary = this.getErrorSummary();

    if (this.edit === 'BATCH_SIZE') {
      this.updateBatchSize();
    } else if (this.isDateTimeEdit()) {
      this.updateDateValues();
    }
  }

  private updateBatchSize() {
    if (this.form.controls.batchSize.invalid) return;

    this.automatedTasksService
      .changeBatchSize(this.task.id, this.form.controls.batchSize.value)
      .subscribe(() =>
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { batchSizeChanged: true } })
      );
  }

  private updateDateValues() {
    if (this.form.controls.date.invalid || this.form.controls.time.invalid) return;

    const date = this.getDateFromForm();
    if (date) {
      this.automatedTasksService.changeDateTime(this.task.id, this.getServerSideKey()!, date).subscribe(() =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParams: { dateChanged: true, label: this.getDateLabel() },
        })
      );
    }
  }

  getErrorSummary(): ErrorSummaryEntry[] {
    return this.formService.getErrorSummary(this.form, AutomatedTaskEditFormErrorMessages);
  }

  getErrorMessages(controlKey: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, AutomatedTaskEditFormErrorMessages);
  }

  isControlInvalid(control: string) {
    return this.form.get(control)?.invalid && this.form.get(control)?.touched;
  }

  private loadDateValues() {
    this.dateLabel = this.getDateLabel();
    const dateKey = this.getDateKey();
    const existingDateTime = dateKey ? this.task[dateKey as keyof AutomatedTaskDetails] : null;

    if (existingDateTime instanceof DateTime) {
      const formattedDate = existingDateTime.toFormat('dd/MM/yyyy');
      this.form.patchValue({
        date: formattedDate,
        time: {
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

  isDateTimeEdit() {
    return (
      this.edit === 'RPO_START_TIME' ||
      this.edit === 'RPO_END_TIME' ||
      this.edit === 'ARM_START_TIME' ||
      this.edit === 'ARM_END_TIME'
    );
  }

  private getDateLabel(): string {
    return datePropertyMap[this.edit as keyof typeof datePropertyMap]?.label || '';
  }

  private getDateKey(): DateKey | null {
    return datePropertyMap[this.edit as keyof typeof datePropertyMap]?.key || null;
  }

  private getServerSideKey(): string | null {
    return datePropertyMap[this.edit as keyof typeof datePropertyMap]?.api_key || null;
  }

  private getDateFromForm(): DateTime | null {
    const dateValue = this.form.get('date')?.value;
    const timeGroup = this.form.get('time')?.value;

    //Assume inputs exist due to form validation
    const [day, month, year] = dateValue!.split('/').map(Number);
    const { hours, minutes, seconds } = timeGroup!;

    const dateTime = DateTime.local(year, month, day, +hours, +minutes, +seconds);

    return dateTime.isValid ? dateTime : null;
  }
}
