import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Case, Hearing } from '@portal-types/index';
import { JoinPipe } from 'src/app/core/pipes/join';
import { LuxonDatePipe } from 'src/app/core/pipes/luxon-date.pipe';

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
