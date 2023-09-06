import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';
import { HearingData } from 'src/app/types/hearing';

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
