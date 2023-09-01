import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent {
  caseDataService: CaseDataService = new CaseDataService;
  
  
}
