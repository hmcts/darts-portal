import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AnnotationService } from '@services/annotation/annotation.service';
import { HeaderService } from '@services/header/header.service';
import { maxFileSizeValidator } from '@validators/max-file-size.validator';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-add-annotation',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbDirective,
    LuxonDatePipe,
    GovukHeadingComponent,
    FileUploadComponent,
    ReactiveFormsModule,
    GovukTextareaComponent,
    RouterLink,
  ],
  templateUrl: './add-annotation.component.html',
  styleUrl: './add-annotation.component.scss',
})
export class AddAnnotationComponent implements OnInit {
  caseId!: string;
  caseNumber!: number;
  hearingDate!: DateTime;
  hearingId!: number;

  headerService = inject(HeaderService);
  router = inject(Router);
  annotationService = inject(AnnotationService);

  fileControl = new FormControl<File | null>(null, [Validators.required, maxFileSizeValidator(20)]);
  annotationComments = new FormControl('');

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.caseId = state!.caseId;
    this.caseNumber = state!.caseNumber;
    this.hearingDate = state!.hearingDate;
    this.hearingId = state!.hearingId;
  }

  onComplete() {
    if (this.annotationComments.value) {
      this.annotationService
        .uploadAnnotationDocument(this.fileControl.value!, this.hearingId, this.annotationComments.value)
        .subscribe(() => {
          this.goToCompletedScreen();
        });
    } else {
      this.annotationService.uploadAnnotationDocument(this.fileControl.value!, this.hearingId).subscribe(() => {
        this.goToCompletedScreen();
      });
    }
  }

  private goToCompletedScreen() {
    this.router.navigate(['/work', this.requestId, 'complete']);
  }

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }
}
