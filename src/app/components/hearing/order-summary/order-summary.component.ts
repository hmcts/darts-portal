import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData, HearingData, HearingPageState, requestPlaybackAudioDTO } from '@darts-types/index';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent {
  @Input() case!: CaseData;
  @Input() hearing!: HearingData | undefined;
  @Input() audioRequest!: requestPlaybackAudioDTO;
  @Output() stateChange = new EventEmitter<HearingPageState>();

  onConfirm() {
    this.stateChange.emit('OrderConfirmation');
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.stateChange.emit('Default');
  }
}
