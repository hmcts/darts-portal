import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { HeaderService } from '@services/header/header.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-set-current-version',
  imports: [LoadingComponent, LuxonDatePipe, GovukHeadingComponent, RouterLink, GovukSummaryListDirectives],
  templateUrl: './set-current-version.component.html',
  styleUrl: './set-current-version.component.scss',
})
export class SetCurrentVersionComponent implements OnInit {
  headerService = inject(HeaderService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  eventsFacadeService = inject(EventsFacadeService);

  isSubmitted = false;

  selectedEventId = this.router.getCurrentNavigation()?.extras?.state?.selectedEventId;

  newVersion = toSignal(of(+this.selectedEventId).pipe(switchMap((id) => this.eventsFacadeService.getEvent(id))));

  ngOnInit() {
    if (!this.selectedEventId) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }

    this.headerService.hideNavigation();
  }

  setCurrentVersion() {
    this.isSubmitted = true;
    this.eventsFacadeService.setCurrentEventVersion(this.selectedEventId).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route, queryParams: { versionSet: true } });
    });
  }
}
