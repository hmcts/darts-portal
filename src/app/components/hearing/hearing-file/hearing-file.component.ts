import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingData } from 'src/app/types/hearing';
import { DateTimeService } from 'src/app/services/datetime/datetime.service';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent {
  reporting_restriction = 'Section 39, Children and Young Persons Act 1933';

  hearing1: HearingData = {
    id: 1,
    date: '2023-09-01',
    judges: ['judge judy', 'judge jeffrey', 'judge jose'],
    courtroom: '99',
    transcriptCount: 100,
  };

  hearing2: HearingData = {
    id: 2,
    date: '2023-18-01',
    judges: ['judge jose'],
    courtroom: '35',
    transcriptCount: 3,
  };

  hearing = this.hearing1;
  courthouse = 'Reading';
  //Courthouse is to come from casefile to-do

  displayHearingDate(d: string): string {
    return DateTimeService.getDMMMYYYY(d);
  }
}
