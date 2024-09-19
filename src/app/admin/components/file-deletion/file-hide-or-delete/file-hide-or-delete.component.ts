import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { FileHideOrDeleteFormErrorMessages } from '@constants/file-hide-or-delete-error-messages';
import { ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { map } from 'rxjs';
import { AssociatedAudioHideDeleteComponent } from '../../transformed-media/associated-audio-hide-delete/associated-audio-hide-delete.component';
import { FileHideOrDeleteSuccessComponent } from '../file-hide-or-delete-success/file-hide-or-delete-success.component';
@Component({
  selector: 'app-file-hide-or-delete',
  standalone: true,
  templateUrl: './file-hide-or-delete.component.html',
  styleUrl: './file-hide-or-delete.component.scss',
  imports: [
    GovukHeadingComponent,
    GovukTextareaComponent,
    ReactiveFormsModule,
    CommonModule,
    ValidationErrorSummaryComponent,
    FileHideOrDeleteSuccessComponent,
    AssociatedAudioHideDeleteComponent,
  ],
})
export class FileHideOrDeleteComponent implements OnInit {
  location = inject(Location);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  transformedMediaService = inject(TransformedMediaService);
  formService = inject(FormService);
  title = inject(Title);

  errors: ErrorSummaryEntry[] = [];

  mediaId = this.router.getCurrentNavigation()?.extras.state?.mediaId ?? null;
  fileType = this.router.getCurrentNavigation()?.extras?.state?.fileType ?? null;

  associatedAudioSearch = this.fileType === 'audio_file' && this.getAssociatedAudioSearch();
  associatedAudio: {
    media: AssociatedMedia[];
    audioFile: AssociatedMedia[];
  } = { media: [], audioFile: [] };

  id = +this.route.snapshot.params.id;

  audioHideComplete = signal(false);
  isSubmitted = signal(false);
  isAssociatedAudio = signal(false);
  continueLink = this.getContinueLink();

  eff = effect(() => {
    if (this.isAssociatedAudio() && !this.audioHideComplete()) {
      this.title.setTitle('DARTS Associated Audio Files');
    } else if (this.audioHideComplete()) {
      this.title.setTitle('DARTS Check For Associated Files');
    } else {
      this.title.setTitle('DARTS Hide or Delete Reason');
    }
  });

  reasons$ = this.transcriptionAdminService
    .getHiddenReasons()
    .pipe(map((reasons) => this.sortAndFilterReasons(reasons)));

  form = this.fb.group({
    ticketReference: ['', [Validators.required, Validators.maxLength(256)]],
    comments: ['', [Validators.required, Validators.maxLength(256)]],
    reason: ['', [Validators.required]],
  });

  hideFormValues!: FileHideOrDeleteFormValues;

  ngOnInit(): void {
    if (!this.fileType) {
      this.router.navigate(['/admin']);
    }
    this.headerService.hideNavigation();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.getErrorSummary();

    if (this.form.valid) {
      this.hideFormValues = {
        ...this.form.value,
        reason: Number(this.form.value.reason),
      } as FileHideOrDeleteFormValues;

      if (this.fileType === 'transcription_document') {
        this.hideTranscriptionDocument();
      } else if (this.fileType === 'audio_file' && this.associatedAudioSearch) {
        this.transformedMediaService
          .checkAssociatedAudioExists(
            this.id,
            this.associatedAudioSearch.hearingIds,
            this.associatedAudioSearch.startAt,
            this.associatedAudioSearch.endAt
          )
          .subscribe((associatedAudio) => {
            // If there are associated audio files, show the associated audio files
            if (associatedAudio.exists) {
              this.isSubmitted.set(true);
              this.isAssociatedAudio.set(true);
              this.associatedAudio = associatedAudio;
            } else {
              this.transformedMediaService.hideAudioFile(this.id, this.hideFormValues).subscribe(() => {
                this.isSubmitted.set(true);
              });
            }
          });
      }
    }
  }

  getMediaById(media: AssociatedMedia[]): AssociatedMedia[] {
    const results = media.filter((media) => media.id === this.id);
    return results;
  }

  private hideTranscriptionDocument() {
    this.hideFormValues &&
      this.transcriptionAdminService.hideTranscriptionDocument(this.id, this.hideFormValues).subscribe(() => {
        this.isSubmitted.set(true);
      });
  }

  private getContinueLink() {
    if (this.fileType === 'transcription_document') {
      return `/admin/transcripts/document/${this.id}`;
    } else if (this.fileType === 'audio_file') {
      return `/admin/audio-file/${this.id}`;
    } else {
      return '/admin';
    }
  }

  goBack() {
    this.location.back();
  }

  getErrorMessages(controlKey: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, FileHideOrDeleteFormErrorMessages);
  }

  isControlInvalid(control: string) {
    return this.form.get(control)?.invalid && this.form.get(control)?.touched;
  }

  getErrorSummary() {
    this.errors = this.formService.getUniqueErrorSummary(this.form, FileHideOrDeleteFormErrorMessages);
  }

  // Only return reasons that are marked for display, and sort based on display order
  private sortAndFilterReasons(reasons: HiddenReason[]): HiddenReason[] {
    return reasons.filter((reason) => reason.displayState).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  private getAssociatedAudioSearch() {
    const hearingIds = this.router.getCurrentNavigation()?.extras?.state?.hearings;
    const startAt = this.router.getCurrentNavigation()?.extras?.state?.dates.startAt;
    const endAt = this.router.getCurrentNavigation()?.extras?.state?.dates.endAt;

    return {
      hearingIds: hearingIds,
      startAt: startAt ?? '',
      endAt: endAt ?? '',
    };
  }
}
