import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporting-restriction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporting-restriction.component.html',
  styleUrls: ['./reporting-restriction.component.scss'],
})
export class ReportingRestrictionComponent {
  @Input() reportingRestriction = '';
}
