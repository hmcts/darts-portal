import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { maxFileSizeValidator } from '@validators/max-file-size.validator';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-upload-transcript',
  standalone: true,
  imports: [
    DetailsTableComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    GovukHeadingComponent,
    FileUploadComponent,
    ReportingRestrictionComponent,
    ValidationErrorSummaryComponent,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    LoadingComponent,
  ],
  templateUrl: './upload-transcript.component.html',
  styleUrl: './upload-transcript.component.scss',
})
export class UploadTranscriptComponent implements OnDestroy {
  transcriptionService = inject(TranscriptionService);
  requestId = inject(ActivatedRoute).snapshot.params.requestId;
  router = inject(Router);
  datePipe = inject(DatePipe);
  luxonPipe = inject(LuxonDatePipe);
  errors: { fieldId: string; message: string }[] = [];

  isManualRequest = false;

  vm$ = this.transcriptionService.getTranscriptionDetails(this.requestId).pipe(
    map((data: TranscriptionDetails) => {
      this.isManualRequest = data.isManual;
      return {
        ...this.transcriptionService.getAssignDetailsFromTranscript(data),
        getAudioQueryParams:
          data.transcriptionStartTs && data.transcriptionEndTs
            ? {
                startTime: this.luxonPipe.transform(data.transcriptionStartTs, 'HH:mm:ss'),
                endTime: this.luxonPipe.transform(data.transcriptionEndTs, 'HH:mm:ss'),
              }
            : null,
      };
    })
  );

  fileControl = new FormControl<File | null>(null, [Validators.required, maxFileSizeValidator(10)]);

  valueChangeSub = this.fileControl.valueChanges.subscribe(() => {
    if (this.isSubmitted) {
      if (this.fileControl.errors?.required) {
        this.errors = [{ fieldId: 'file-upload-1', message: 'You must upload a file to complete this request' }];
        return;
      }
      if (this.fileControl.errors?.maxFileSize) {
        this.errors = [{ fieldId: 'file-upload-1', message: 'The selected file must be smaller than 10MB.' }];
        return;
      }
      this.errors = [];
    }
  });

  isSubmitted = false;

  onComplete() {
    this.isSubmitted = true;
    this.fileControl.updateValueAndValidity();
    if (this.fileControl.invalid && this.isManualRequest) {
      return;
    }
    if (this.isManualRequest) {
      this.transcriptionService.uploadTranscript(this.requestId, this.fileControl.value!).subscribe(() => {
        this.goToCompletedScreen();
      });
    } else {
      this.transcriptionService.completeTranscriptionRequest(this.requestId).subscribe(() => {
        this.goToCompletedScreen();
      });
    }
  }

  private goToCompletedScreen() {
    this.router.navigate(['/work', this.requestId, 'complete']);
  }

  ngOnDestroy() {
    this.valueChangeSub.unsubscribe();
  }
}
