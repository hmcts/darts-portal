import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingData } from 'src/app/types/hearing';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent {
  @Input() hearings: HearingData[] = [];
}
