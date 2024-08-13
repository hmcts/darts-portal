import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { FormErrorMessages } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { AudioFileResultsComponent } from '../audio-file-results/audio-file-results.component';

const controlErrors: FormErrorMessages = {
  deletionApproval: {
    required: 'Select your decision',
  },
};

@Component({
  selector: 'app-audio-file-delete',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    ReactiveFormsModule,
    RouterLink,
    DataTableComponent,
    LuxonDatePipe,
    TableRowTemplateDirective,
    ValidationErrorSummaryComponent,
    AudioFileResultsComponent,
  ],
  templateUrl: './audio-file-delete.component.html',
  styleUrl: './audio-file-delete.component.scss',
})
export class AudioFileDeleteComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  headerService = inject(HeaderService);
  fileDeletionService = inject(FileDeletionService);
  transformedMediaService = inject(TransformedMediaService);

  isPermitted = this.router.getCurrentNavigation()?.extras?.state?.isPermitted;
  audioFileState = this.router.getCurrentNavigation()?.extras?.state?.file;
  audioFile = this.parseAudioFileDates(this.audioFileState);

  deletionApproval = new FormControl(null, [Validators.required]);

  ngOnInit(): void {
    !this.audioFile && this.router.navigate(['/admin/file-deletion']);
    this.headerService.hideNavigation();
  }

  //Required to enable display of dates upon refresh, due to passing through state
  private parseAudioFileDates(audio: typeof this.audioFileState): AudioFileMarkedDeletion {
    return {
      ...audio,
      startAt: DateTime.fromISO(audio.startAt),
      endAt: DateTime.fromISO(audio.endAt),
    };
  }

  getApprovalChoiceErrors(): string[] {
    return this.deletionApproval.errors?.length > 0 || this.deletionApproval.touched
      ? Object.keys(this.deletionApproval.errors || {}).map((error) => controlErrors['deletionApproval'][error])
      : [];
  }

  confirm() {
    this.deletionApproval.markAllAsTouched();

    if (!this.deletionApproval.valid) {
      return;
    } else {
      if (this.deletionApproval.value) {
        this.fileDeletionService.approveAudioFileDeletion(this.audioFile.mediaId).subscribe(() => {
          this.router.navigate(['/admin/file-deletion'], { queryParams: { approvedForDeletion: true } });
        });
      } else {
        this.transformedMediaService.unhideAudioFile(this.audioFile.mediaId).subscribe(() => {
          this.router.navigate(['/admin/file-deletion'], { queryParams: { unmarkedAndUnhidden: true } });
        });
      }
    }
  }

  getErrorSummary() {
    return this.getApprovalChoiceErrors().length > 0
      ? [{ fieldId: 'deletionApproval', message: this.getApprovalChoiceErrors()[0] }]
      : [];
  }
}
