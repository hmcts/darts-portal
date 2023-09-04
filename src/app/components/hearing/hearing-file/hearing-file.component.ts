import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingData } from 'src/app/types/hearing';
import { DateTimeService } from 'src/app/services/datetime/datetime.service';
import { CaseData } from 'src/app/types/case';

@Component({
  selector: 'app-hearing-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hearing-file.component.html',
  styleUrls: ['./hearing-file.component.scss'],
})
export class HearingFileComponent implements OnInit {
  reporting_restriction = 'Section 39, Children and Young Persons Act 1933';

  @Input() case!: CaseData;
  @Input() hearing!: HearingData;
 
  ngOnInit(): void {
    console.log('ng on init')
    console.log(this.case);
    console.log(this.hearing);
  }

  displayHearingDate(d: string): string {
    return DateTimeService.getDMMMYYYY(d);
  }
}
