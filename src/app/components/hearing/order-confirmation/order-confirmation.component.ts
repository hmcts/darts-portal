import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AudioRequest, Case, Hearing, HearingPageState } from '@darts-types/index';
import { UserState } from '@darts-types/user-state';
import { HeaderService } from '@services/header/header.service';
import { ErrorMessageService } from '@services/error/error-message.service';
import { AppConfigService } from '@services/app-config/app-config.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  @Input() case!: Case;
  @Input() hearing!: Hearing | undefined;
  @Input() audioRequest!: AudioRequest;
  @Input() requestId!: number;
  @Input() state!: HearingPageState;
  @Input() userState!: UserState | null | undefined;

  @Output() stateChange = new EventEmitter<HearingPageState>();
  @Output() orderConfirm = new EventEmitter<AudioRequest>();

  headerService = inject(HeaderService);
  router = inject(Router);

  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;
  errorService = inject(ErrorMessageService);
  error$ = this.errorService.errorMessage$;

  onConfirm() {
    this.orderConfirm.emit(this.audioRequest);
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }

  onReturnToHearing(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }

  onReturnToSearch(event: Event) {
    event.preventDefault();
    this.headerService.showNavigation();
    this.router.navigate(['/search']);
  }
}
