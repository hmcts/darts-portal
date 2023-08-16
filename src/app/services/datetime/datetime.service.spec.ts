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
    spyOn(service, 'getdddDMMMYYYY').and.callThrough();

    const date = service.getdddDMMMYYYY('2023-08-16');

    expect(service.getdddDMMMYYYY).toHaveBeenCalled();
    expect(date).toBe('Wed 16 Aug 2023');
  });
});
