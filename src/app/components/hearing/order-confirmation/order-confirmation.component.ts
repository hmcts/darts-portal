import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData, HearingData, HearingPageState, requestPlaybackAudioDTO } from '@darts-types/index';

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

  onReturnToHearing(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }

  onReturnToSearch(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }
}
