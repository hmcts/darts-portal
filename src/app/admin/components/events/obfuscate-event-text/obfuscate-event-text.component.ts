import { Component, inject, input, numberAttribute, OnInit } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { HeaderService } from '@services/header/header.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-obfuscate-event-text',
  standalone: true,
  imports: [GovukHeadingComponent, RouterLink, LoadingComponent],
  templateUrl: './obfuscate-event-text.component.html',
  styleUrl: './obfuscate-event-text.component.scss',
})
export class ObfuscateEventTextComponent implements OnInit {
  router = inject(Router);
  headerService = inject(HeaderService);
  searchService = inject(AdminSearchService);
  eventsFacadeService = inject(EventsFacadeService);

  id = input(0, { transform: numberAttribute });

  event = toSignal(toObservable(this.id).pipe(switchMap((id) => this.eventsFacadeService.getEvent(id))));

  ngOnInit() {
    this.headerService.hideNavigation();
  }

  onContinue() {
    this.eventsFacadeService.obfuscateEventText(this.id()).subscribe(() => {
      this.searchService.fetchNewEvents.set(true);
      this.navigateBackToEvent();
    });
  }

  navigateBackToEvent() {
    this.router.navigate(['/admin/events', this.id()], { queryParams: { isObfuscationSuccess: true } });
  }
}
