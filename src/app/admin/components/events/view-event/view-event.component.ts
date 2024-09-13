import { Component, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ExpiredBannerComponent } from '@common/expired-banner/expired-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { UserService } from '@services/user/user.service';
import { switchMap } from 'rxjs';
import { AdvancedEventDetailsComponent } from '../advanced-event-details/advanced-event-details.component';
import { BasicEventDetailsComponent } from '../basic-event-details/basic-event-details.component';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [
    RouterLink,
    GovukHeadingComponent,
    LoadingComponent,
    TabsComponent,
    TabDirective,
    BasicEventDetailsComponent,
    AdvancedEventDetailsComponent,
    ExpiredBannerComponent,
  ],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss',
})
export class ViewEventComponent {
  eventsFacadeService = inject(EventsFacadeService);
  userService = inject(UserService);

  id = input(0, { transform: numberAttribute });

  event = toSignal(toObservable(this.id).pipe(switchMap((id) => this.eventsFacadeService.getEvent(id))));
}
