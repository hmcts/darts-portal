import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Case, Hearing, HearingPageState, PostAudioRequest } from '@portal-types/index';
import { UserState } from 'src/app/core/models/user/user-state.interface';
import { LuxonDatePipe } from 'src/app/core/pipes/luxon-date.pipe';
import { HeaderService } from 'src/app/core/services/header/header.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, LuxonDatePipe],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  @Input() case!: Case;
  @Input() hearing!: Hearing | undefined;
  @Input() audioRequest!: PostAudioRequest;
  @Input() requestId!: number;
  @Input() state!: HearingPageState;
  @Input() userState!: UserState | null | undefined;

  @Output() stateChange = new EventEmitter<HearingPageState>();
  @Output() orderConfirm = new EventEmitter<PostAudioRequest>();

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
    this.headerService.showNavigation();
    this.router.navigate(['/search']);
  }
}
