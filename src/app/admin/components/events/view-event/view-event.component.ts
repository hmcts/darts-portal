import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ExpiredBannerComponent } from '@common/expired-banner/expired-banner.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { UserService } from '@services/user/user.service';
import { optionalStringToBooleanOrNull } from '@utils/index';
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
    GovukBannerComponent,
  ],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss',
})
export class ViewEventComponent {
  eventsFacadeService = inject(EventsFacadeService);
  userService = inject(UserService);
  router = inject(Router);
  isEventObfuscationEnabled = inject(FeatureFlagService).isEventObfuscationEnabled();

  id = input(0, { transform: numberAttribute });
  isObfuscationSuccess = input(null, { transform: optionalStringToBooleanOrNull });

  event = toSignal(toObservable(this.id).pipe(switchMap((id) => this.eventsFacadeService.getEvent(id))));

  // event obfuscation feature flag must be enabled, user must be SUPER_ADMIN, event is not already obfuscated
  showObfuscateButton = computed(
    () => this.isEventObfuscationEnabled && this.userService.isAdmin() && !this.event()?.isDataAnonymised
  );

  showAnonymisedTextBanner = computed(() => this.event()?.isDataAnonymised);

  onObfuscateEventText() {
    this.router.navigate(['/admin/events', this.id(), 'obfuscate']);
  }
}
