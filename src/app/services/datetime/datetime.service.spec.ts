import { TestBed } from '@angular/core/testing';

import { DateTimeService } from './datetime.service';

describe('DatetimeService', () => {
  let service: DateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct date formats when passing in YYYY-MM-DD', () => {
    jest.spyOn(DateTimeService, 'getdddDMMMYYYY');

    const date = DateTimeService.getdddDMMMYYYY('2023-08-16');

    expect(DateTimeService.getdddDMMMYYYY).toHaveBeenCalled();
    expect(date).toBe('Wed 16 Aug 2023');
  });

  it('should format ISO Strings to remove milliseconds', () => {
    const date = '2023-09-01T01:00:00.000Z';
    const expectedDate = '2023-09-01T01:00:00Z';
    const result = service.getIsoStringWithoutMilliseconds(date);
    expect(result).toEqual(expectedDate);
  });
});
