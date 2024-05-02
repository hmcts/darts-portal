import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { TranscriptStatus } from '@portal-types/index';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';

@Component({
  selector: 'app-change-transcript-status',
  standalone: true,
  imports: [ReactiveFormsModule, GovukHeadingComponent, GovukTextareaComponent, AsyncPipe, JsonPipe],
  templateUrl: './change-transcript-status.component.html',
  styleUrl: './change-transcript-status.component.scss',
})
export class ChangeTranscriptStatusComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);
  transcriptionAdminService = inject(TranscriptionAdminService);

  transcriptId = Number(this.route.snapshot.params.transcriptionId);
  transcriptStatus: TranscriptStatus = this.route.snapshot.queryParams.status;
  isManual = this.route.snapshot.queryParams.manual === 'true';

  statuses$ = this.transcriptionAdminService.getAllowableTranscriptionStatuses(this.transcriptStatus, this.isManual);

  form = this.fb.group({
    status: ['', [Validators.required]],
    comments: [''],
  });

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const statusId = Number(this.form.controls.status.value);
    const comments = String(this.form.controls.comments.value);

    this.transcriptionAdminService.updateTranscriptionStatus(this.transcriptId, statusId, comments).subscribe(() => {
      this.router.navigate(['/admin/transcripts', this.transcriptId], { queryParams: { updatedStatus: true } });
    });
  }
}
