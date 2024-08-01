import { JsonPipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AnnotationService } from '@services/annotation/annotation.service';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { maxFileSizeValidator } from '@validators/max-file-size.validator';
import { switchMap, tap } from 'rxjs';
import { AddAnnotationSuccessComponent } from './add-annotation-success/add-annotation-success.component';

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
    AddAnnotationSuccessComponent,
    JsonPipe,
  ],
  templateUrl: './add-annotation.component.html',
  styleUrl: './add-annotation.component.scss',
})
export class AddAnnotationComponent implements OnInit {
  router = inject(Router);
  caseService = inject(CaseService);
  headerService = inject(HeaderService);
  annotationService = inject(AnnotationService);

  // URL params bind to the component signal inputs
  // /case/{caseId}/hearing/{hearingId}/annotation?caseNumber=123456
  caseId = input.required({ transform: numberAttribute });
  hearingId = input.required({ transform: numberAttribute });
  caseNumber = input('');

  ids = computed(() => [this.caseId(), this.hearingId()]);

  hearing = toSignal(
    toObservable(this.ids).pipe(
      switchMap(([caseId, hearingId]) => this.caseService.getHearingById(caseId, hearingId)),
      tap((hearing) => hearing ?? this.router.navigate(['/page-not-found']))
    )
  );

  fileControl = new FormControl<File | null>(null, [Validators.required, maxFileSizeValidator(20)]);
  annotationComments = new FormControl('');
  step = 1;

  onComplete() {
    if (this.annotationComments.value) {
      this.annotationService
        .uploadAnnotationDocument(this.fileControl.value!, this.hearingId(), this.annotationComments.value)
        .subscribe(() => {
          this.goToSuccessScreen();
        });
    } else {
      this.annotationService.uploadAnnotationDocument(this.fileControl.value!, this.hearingId()).subscribe(() => {
        this.goToSuccessScreen();
      });
    }
  }

  public goToSuccessScreen() {
    this.step = 2;
  }

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }
}
