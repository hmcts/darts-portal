import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { LuxonDatePipe } from './luxon-date.pipe';

describe('LuxonDatePipe', () => {
  let pipe: LuxonDatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
    });

    pipe = TestBed.runInInjectionContext(() => new LuxonDatePipe());
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

  it('should return null when the DateTime is invalid', () => {
    const invalid = DateTime.invalid('bad input');
    const result = pipe.transform(invalid, 'yyyy-MM-dd');
    expect(result).toBeNull();
  });
});
