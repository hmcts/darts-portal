import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [],
  templateUrl: './play-button.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./play-button.component.scss'],
})
export class PlayButtonComponent {
  @Input() isPlaying = false;
  @Input() isPaused = false;
}
