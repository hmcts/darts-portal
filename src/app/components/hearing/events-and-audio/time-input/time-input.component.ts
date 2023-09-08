import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
})
export class TimeInputComponent {
  @Input() hours = 0;
  @Input() minutes = 0;
  @Input() seconds = 0;
}
