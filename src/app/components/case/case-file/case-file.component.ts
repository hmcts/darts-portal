import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData } from 'src/app/types/case';

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
