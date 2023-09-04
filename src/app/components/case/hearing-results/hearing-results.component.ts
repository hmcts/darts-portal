import { Component, EventEmitter, Input, Output,  } from '@angular/core';
import { CommonModule} from '@angular/common';
import { HearingData } from 'src/app/types/hearing';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent {
  caseId: number; 
  @Input() hearings: HearingData[] = [];

  constructor(private route: ActivatedRoute, private caseDataService: CaseDataService) {
    this.caseId = this.route.snapshot.params.caseId;
  }
}
