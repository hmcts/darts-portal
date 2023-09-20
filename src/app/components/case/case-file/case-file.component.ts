import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData } from '@darts-types/index';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  @Input() public caseFile!: CaseData;
}
