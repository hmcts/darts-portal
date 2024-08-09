import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ErrorSummaryEntry, FormErrorMessages } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { forkJoin } from 'rxjs';
import { AssociatedAudioTableComponent } from '../associated-audio-table/associated-audio-table.component';

const controlErrors: FormErrorMessages = {
  selectedFileChoice: {
    required: 'Choose if you want to include associated files or not',
  },
  selectedFiles: {
    required: 'Select files to include',
  },
};

@Component({
  selector: 'app-associated-audio-hide-delete',
  standalone: true,
  templateUrl: './associated-audio-hide-delete.component.html',
  styleUrl: './associated-audio-hide-delete.component.scss',
  imports: [GovukHeadingComponent, DataTableComponent, AssociatedAudioTableComponent, ReactiveFormsModule],
})
export class AssociatedAudioHideDeleteComponent {
  transformedMediaService = inject(TransformedMediaService);
  router = inject(Router);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  @Input() audioFile: AssociatedMedia[] = [];
  @Input() media: AssociatedMedia[] = [];
  @Input() id!: number;
  @Input() fileFormValues!: FileHideOrDeleteFormValues;

  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();
  @Output() successResponse = new EventEmitter<boolean>();

  selectedRows: ReturnType<AssociatedAudioTableComponent['mapRows']> = [];
  controlErrors = controlErrors;
  isSubmitted = false;

  form = new FormGroup({
    selectedFileChoice: new FormControl('', Validators.required),
  });

  associatedAudioSubmit() {
    this.isSubmitted = true;
    this.form.markAllAsTouched();
    const includeSelectedFiles = Boolean(this.form.value.selectedFileChoice);

    if (this.form.invalid) {
      this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.errors.emit(this.getErrorSummary());
      });
      this.form.updateValueAndValidity();
      return;
    }

    if (this.selectedRows.length === 0 && includeSelectedFiles) return;

    this.hideAudioFiles(includeSelectedFiles);

    this.errors.emit([]);
    this.isSubmitted = false;
  }

  private hideAudioFiles(includeSelectedFiles: boolean) {
    if (includeSelectedFiles) {
      const selectedIds = this.selectedRows.map((row) => row.audioId);
      selectedIds.push(this.id);

      const responses = selectedIds.map((id) => {
        return this.transformedMediaService.hideAudioFile(id, this.fileFormValues);
      });
      forkJoin(responses).subscribe({
        next: () => {
          this.successResponse.emit(true);
        },
      });
    } else {
      this.transformedMediaService.hideAudioFile(this.id, this.fileFormValues).subscribe(() => {
        this.successResponse.emit(true);
      });
    }
  }

  private getErrorSummary() {
    const errors: ErrorSummaryEntry[] = this.formService.getErrorSummary(this.form, controlErrors);

    if (this.form.controls.selectedFileChoice.value && this.selectedRows.length === 0) {
      errors.push({ fieldId: 'selectedFiles', message: controlErrors.selectedFiles.required });
    }

    return errors;
  }

  goBack() {
    this.router.navigate(['/admin/audio-file', this.id]);
  }

  getErrorMessages(controlKey: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, controlErrors);
  }

  isControlInvalid(control: string) {
    return this.form.get(control)?.invalid && this.form.get(control)?.touched;
  }
}
