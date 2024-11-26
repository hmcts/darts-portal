import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { Location } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { FormService } from '@services/form/form.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { finalize, forkJoin } from 'rxjs';
import { AssociatedAudioTableComponent } from '../associated-audio-table/associated-audio-table.component';
const controlError = [
  {
    fieldId: 'associatedAudioTable',
    message: 'Select files to include',
  },
];
@Component({
  selector: 'app-associated-audio-hide-delete',
  standalone: true,
  templateUrl: './associated-audio-hide-delete.component.html',
  styleUrl: './associated-audio-hide-delete.component.scss',
  imports: [GovukHeadingComponent, AssociatedAudioTableComponent],
})
export class AssociatedAudioHideDeleteComponent implements OnInit {
  location = inject(Location);
  transformedMediaService = inject(TransformedMediaService);
  router = inject(Router);
  formService = inject(FormService);
  destroyRef = inject(DestroyRef);

  @Input() transformedMediaId!: number;
  @Input() fileFormValues!: FileHideOrDeleteFormValues;

  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();
  @Output() successResponse = new EventEmitter<boolean>();

  media = input.required<AssociatedMedia[]>();
  selectedRows = model<AssociatedMedia[]>([]);
  isSubmitted = signal(false);

  ngOnInit(): void {
    this.selectedRows.set(this.media());
  }

  associatedAudioSubmit() {
    this.isSubmitted.set(true);

    if (this.selectedRows().length === 0) {
      this.errors.emit(controlError);
      return;
    }

    const selectedIds = [
      ...new Set(
        this.selectedRows()
          .filter((row) => !row.isHidden)
          .map((row) => row.id)
      ),
    ];

    const requests = selectedIds.map((id) => this.transformedMediaService.hideAudioFile(id, this.fileFormValues));

    forkJoin(requests)
      .pipe(
        finalize(() => {
          this.successResponse.emit(true);
          this.errors.emit([]);
          this.isSubmitted.set(false);
        })
      )
      .subscribe();
  }

  goBack() {
    this.location.back();
  }
}
