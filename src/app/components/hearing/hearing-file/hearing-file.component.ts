import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData, HearingData } from '@darts-types/index';
import { JoinPipe } from '@pipes/join';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule, JoinPipe],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent {
  @Input() case!: CaseData | null;
  @Input() hearing!: HearingData | null | undefined;
}
