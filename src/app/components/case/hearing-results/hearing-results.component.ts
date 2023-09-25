import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Hearing } from '@darts-types/index';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent {
  caseId: number;
  @Input() hearings: Hearing[] = [];

  constructor(private route: ActivatedRoute) {
    this.caseId = this.route.snapshot.params.caseId;
  }
}
