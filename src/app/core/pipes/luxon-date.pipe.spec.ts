import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { LuxonDatePipe } from './luxon-date.pipe';

describe('LuxonDatePipe', () => {
  let pipe: LuxonDatePipe;
  let datePipe: DatePipe;

  beforeEach(() => {
    datePipe = new DatePipe('en-GB');
    pipe = new LuxonDatePipe(datePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a valid DateTime to a formatted string', () => {
    const dateTime = DateTime.fromISO('2022-01-01T12:00:00Z');
    const format = 'yyyy-MM-dd HH:mm:ss';
    const expected = '2022-01-01 12:00:00';

    const result = pipe.transform(dateTime, format);

    expect(result).toEqual(expected);
  });

  it('should return null when the value is undefined', () => {
    const format = 'yyyy-MM-dd HH:mm:ss';

    const result = pipe.transform(undefined, format);

    expect(result).toBeNull();
  });
});
