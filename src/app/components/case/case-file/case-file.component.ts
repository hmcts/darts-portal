import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData } from '@darts-types/index';
import { JoinPipe } from '@pipes/join';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, JoinPipe],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  @Input() public caseFile!: CaseData;
}
