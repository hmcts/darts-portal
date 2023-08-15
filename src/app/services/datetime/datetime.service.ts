import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  //e.g. Mon 26 Sep 2023
  getdddDMMMYYYY(date: string) {
    if (date) {
      return moment(date, 'YYYY-MM-DD', true).format('ddd D MMM YYYY');
    } else {
      return '';
    }
  }
}
