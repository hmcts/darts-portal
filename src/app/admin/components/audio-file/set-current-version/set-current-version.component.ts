import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { BytesPipe } from '@pipes/bytes.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-set-current-version',
  imports: [
    GovukHeadingComponent,
    GovukSummaryListDirectives,
    RouterLink,
    BytesPipe,
    DecimalPipe,
    LuxonDatePipe,
    LoadingComponent,
  ],
  templateUrl: './set-current-version.component.html',
  styleUrl: './set-current-version.component.scss',
})
export class SetCurrentVersionComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  transformedMediaService = inject(TransformedMediaService);

  selectedAudioId = this.router.getCurrentNavigation()?.extras?.state?.selectedAudioId;

  newVersion = toSignal(
    of(+this.selectedAudioId).pipe(switchMap((id) => this.transformedMediaService.getMediaById(id)))
  );

  bytesInMb = 1024 * 1024;

  ngOnInit() {
    if (!this.selectedAudioId) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  setCurrentVersion() {
    this.transformedMediaService.setCurrentVersion(this.selectedAudioId).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route, queryParams: { versionSet: true } });
    });
  }
}
