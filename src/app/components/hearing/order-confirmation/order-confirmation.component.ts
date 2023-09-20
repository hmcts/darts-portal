import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData, HearingData, HearingPageState, requestPlaybackAudioDTO } from '@darts-types/index';
import { HeaderService } from '@services/header/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  @Input() case!: CaseData;
  @Input() hearing!: HearingData | undefined;
  @Input() audioRequest!: requestPlaybackAudioDTO;
  @Output() stateChange = new EventEmitter<HearingPageState>();

  headerService = inject(HeaderService);
  router = inject(Router);

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
