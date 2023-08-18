import { Component, Input } from '@angular/core';
import { CaseData } from '../../../../app/types/case';
import { DateTimeService } from '../../../services/datetime/datetime.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  @Input() casesInput: CaseData[] = [];
  @Input() loaded = false;
  @Input() errorType = '';

  constructor(private dateTimeService: DateTimeService) {}

  getDateFormat(d: string) {
    return this.dateTimeService.getdddDMMMYYYY(d);
  }

  //Fetches correct display value for defendants and judges
  getNameValue(arr: string[] | undefined) {
    if (arr) {
      if (arr.length === 0) {
        return '';
      } else {
        if (arr.length < 2) {
          return arr[0];
        } else {
          return 'Multiple';
        }
      }
    } else {
      return '';
    }
  }

  //Fetches correct display value for dates and courtrooms
  getHearingsValue(c: CaseData, key: string) {
    if (!c.hearings || c.hearings.length === 0) {
      return '';
    } else {
      if (c.hearings.length < 2) {
        if (key === 'date') {
          return this.getDateFormat(c.hearings[0][key]);
        } else {
          return c.hearings[0][key];
        }
      } else {
        return 'Multiple';
      }
    }
  }
}
