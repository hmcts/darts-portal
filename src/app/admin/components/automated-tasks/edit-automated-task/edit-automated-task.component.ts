import { AutomatedTaskDetails, AutomatedTaskDetailsState } from '@admin-types/automated-task/automated-task';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TimeInputComponent } from '@components/hearing/request-playback-audio/time-input/time-input.component';
import { AutomatedTaskEditFormErrorMessages, maxIntegerSize } from '@constants/automated-task-edit-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { FormService } from '@services/form/form.service';
import { realDateValidator } from '@validators/real-date.validator';
import { timeGroupValidator } from '@validators/time-group.validator';
import { DateTime } from 'luxon';

interface EditPropertyMap {
  [key: string]: EditProperty;
}

interface EditProperty {
  label: string;
  key: string;
  api_key: string;
  type: 'number' | 'string' | 'datetime';
  validators?: ValidatorFn[];
}

export const EDIT_PROPERTY_MAP: EditPropertyMap = {
  BATCH_SIZE: {
    label: 'Batch size',
    key: 'batchSize',
    api_key: 'batch_size',
    type: 'number',
    validators: [Validators.required, Validators.min(1), Validators.max(maxIntegerSize), Validators.pattern(/^-?\d+$/)],
  },
  ARM_RPO_CSV_START_HOUR: {
    label: 'RPO CSV start hour',
    key: 'rpoCsvStartHour',
    api_key: 'rpo_csv_start_hour',
    type: 'number',
    validators: [Validators.required, Validators.min(1), Validators.max(maxIntegerSize), Validators.pattern(/^-?\d+$/)],
  },
  ARM_RPO_CSV_END_HOUR: {
    label: 'RPO CSV end hour',
    key: 'rpoCsvEndHour',
    api_key: 'rpo_csv_end_hour',
    type: 'number',
    validators: [Validators.required, Validators.min(1), Validators.max(maxIntegerSize), Validators.pattern(/^-?\d+$/)],
  },
  ARM_REPLAY_START_TIME: {
    label: 'ARM Replay start time',
    key: 'armReplayStartTs',
    api_key: 'arm_replay_start_ts',
    type: 'datetime',
  },
  ARM_REPLAY_END_TIME: {
    label: 'ARM Replay end time',
    key: 'armReplayEndTs',
    api_key: 'arm_replay_end_ts',
    type: 'datetime',
  },
};

export type EditType = keyof typeof EDIT_PROPERTY_MAP;

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
  form!: FormGroup;

  isSubmitted = signal(false);

  constructor() {
    this.task = this.parseDateValues(this.taskState);
    this.edit = this.router.getCurrentNavigation()?.extras.state?.edit;

    if (!this.taskState || !this.edit) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.setupFormControls();
      this.loadFormControlValues();
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.isSubmitted.set(true);
    this.form.updateValueAndValidity();
    this.validationErrorSummary = this.getErrorSummary();
    this.updateEditField();
  }

  private setupFormControls() {
    if (this.isDateTimeEdit) {
      this.form = this.fb.group({
        date: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
            realDateValidator,
          ],
        ],
        time: this.fb.group(
          {
            hours: ['', [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
            minutes: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
            seconds: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
          },
          { validators: timeGroupValidator }
        ),
      });
    } else {
      const editProperty = EDIT_PROPERTY_MAP[this.edit];
      this.form = this.fb.group({
        [editProperty.key]: this.fb.control(0, editProperty.validators),
      });
    }
  }

  private updateEditField() {
    const fieldKey = this.getEditFieldKey();
    if (this.form.get(fieldKey)?.invalid) return;

    const fieldType = this.getEditFieldType();
    const fieldApiKey = this.getEditFieldApiKey();
    if (fieldType === 'datetime') {
      const date = this.getDateFromForm();
      if (date) {
        this.automatedTasksService.changeFieldValue(this.task.id, fieldApiKey, date).subscribe(() =>
          this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: { labelChanged: this.getEditFieldLabel() },
          })
        );
      }
    } else {
      const formValue = this.form.get(fieldKey)?.value;
      const value = fieldType === 'number' ? parseInt(formValue, 10) : formValue;
      this.automatedTasksService.changeFieldValue(this.task.id, fieldApiKey, value).subscribe(() =>
        this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParams: { labelChanged: this.getEditFieldLabel() },
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

  private loadFormControlValues() {
    if (this.isDateTimeEdit) {
      this.loadDateValue();
    } else {
      this.loadInputValue();
    }
  }

  private loadDateValue() {
    this.dateLabel = this.getEditFieldLabel();
    const dateKey = this.getEditFieldKey();
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
  }

  private loadInputValue() {
    const fieldKey = this.getEditFieldKey();
    this.form.get(fieldKey)?.setValue(this.task[fieldKey as keyof AutomatedTaskDetails]);

    this.form
      .get(fieldKey)
      ?.events.pipe(takeUntilDestroyed())
      .subscribe(({ source }) => {
        if (source.errors && this.isSubmitted()) {
          this.validationErrorSummary = this.getErrorSummary();
        } else {
          this.validationErrorSummary = [];
        }
      });
  }

  //Ensures datetime persist on refresh after being passed through state
  private parseDateValues(taskState: AutomatedTaskDetailsState): AutomatedTaskDetails {
    return {
      ...taskState,
      armReplayStartTs: taskState.armReplayStartTs ? DateTime.fromISO(taskState.armReplayStartTs) : undefined,
      armReplayEndTs: taskState.armReplayEndTs ? DateTime.fromISO(taskState.armReplayEndTs) : undefined,
    };
  }

  get isDateTimeEdit() {
    return this.getEditFieldType() === 'datetime';
  }

  get fieldLabel() {
    return this.getEditFieldLabel();
  }

  get fieldKey() {
    return this.getEditFieldKey();
  }

  private getEditFieldLabel(): EditProperty['label'] {
    return EDIT_PROPERTY_MAP[this.edit].label;
  }

  private getEditFieldKey(): EditProperty['key'] {
    return EDIT_PROPERTY_MAP[this.edit].key;
  }

  private getEditFieldApiKey(): EditProperty['api_key'] {
    return EDIT_PROPERTY_MAP[this.edit].api_key;
  }

  private getEditFieldType(): EditProperty['type'] {
    return EDIT_PROPERTY_MAP[this.edit].type;
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
