import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingData } from 'src/app/types/hearing';
import { RouterLink } from '@angular/router';
import { CaseData } from 'src/app/types/case';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent {
  @Input() case!: CaseData;
  @Input() hearing!: HearingData;
}
