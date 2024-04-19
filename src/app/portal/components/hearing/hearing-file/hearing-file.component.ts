import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Case, Hearing } from '@portal-types/index';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule, JoinPipe, LuxonDatePipe, GovukHeadingComponent],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent {
  @Input() case!: Case | null;
  @Input() hearing!: Hearing | null | undefined;
}
