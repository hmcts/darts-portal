import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';

@Component({
  selector: 'app-hearing',
  standalone: true,
  imports: [CommonModule, HearingFileComponent],
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
})
export class HearingComponent {
  caseDataService: CaseDataService = new CaseDataService();

  

}
