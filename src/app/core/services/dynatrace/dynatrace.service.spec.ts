import { TestBed } from '@angular/core/testing';

import { DynatraceService } from './dynatrace.service';

describe('DynatraceService', () => {
  let service: DynatraceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynatraceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
