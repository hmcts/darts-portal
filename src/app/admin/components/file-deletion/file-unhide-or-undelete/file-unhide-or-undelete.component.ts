import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { finalize, forkJoin } from 'rxjs';
import { AssociatedAudioHideDeleteComponent } from '../../transformed-media/associated-audio-hide-delete/associated-audio-hide-delete.component';

@Component({
  selector: 'app-file-unhide-or-undelete',
  standalone: true,
  imports: [AssociatedAudioHideDeleteComponent, ValidationErrorSummaryComponent],
  templateUrl: './file-unhide-or-undelete.component.html',
  styleUrl: './file-unhide-or-undelete.component.scss',
})
export class FileUnhideOrUndeleteComponent implements OnInit {
  transformedMediaService = inject(TransformedMediaService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);

  media = this.router.getCurrentNavigation()?.extras.state?.media as AssociatedMedia[];
  errors = signal<ErrorSummaryEntry[]>([]);

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onSelectionConfirmed(selectedIds: number[]) {
    const requests = selectedIds.map((id) => this.transformedMediaService.unhideAudioFile(id));

    forkJoin(requests)
      .pipe(
        finalize(() =>
          this.router.navigate(['../../'], {
            relativeTo: this.route,
            queryParams: {
              unhiddenOrUnmarkedForDeletion: true,
              backUrl: this.route.snapshot.queryParamMap.get('backUrl'),
            },
          })
        )
      )
      .subscribe();
  }
}
