import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CaseData, HearingData } from '@darts-types/index';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent {
  @Input() case!: CaseData | null;
  @Input() hearing!: HearingData | null | undefined;
}
