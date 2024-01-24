import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Case, Hearing } from '@darts-types/index';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule, JoinPipe, LuxonDatePipe],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent {
  @Input() case!: Case | null;
  @Input() hearing!: Hearing | null | undefined;
}
