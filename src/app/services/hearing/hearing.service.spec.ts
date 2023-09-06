import { TestBed } from '@angular/core/testing';

import { HearingService } from './hearing.service';

describe('HearingService', () => {
  let service: HearingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HearingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
