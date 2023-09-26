import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioRequest, Case, Hearing, HearingPageState } from '@darts-types/index';
import { HeaderService } from '@services/header/header.service';
import { Router } from '@angular/router';
import UserState from 'server/types/classes/userState';

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
  @Input() userProfile?: UserState | null | undefined;

  @Output() stateChange = new EventEmitter<HearingPageState>();
  @Output() orderConfirm = new EventEmitter<AudioRequest>();

  headerService = inject(HeaderService);
  router = inject(Router);

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
    this.headerService.showPrimaryNavigation(true);
    this.router.navigate(['/search']);
  }
}
