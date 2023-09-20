import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseData } from '@darts-types/index';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, ReportingRestrictionComponent],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  @Input() public caseFile!: CaseData;
}
