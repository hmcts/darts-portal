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
});
