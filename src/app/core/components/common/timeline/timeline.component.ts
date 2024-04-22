import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimelineItem } from '@core-types/index';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [LuxonDatePipe, RouterLink],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];
}
