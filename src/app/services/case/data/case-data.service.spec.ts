import { TestBed } from '@angular/core/testing';

import { CaseDataService } from './case-data.service';

describe('CaseDataService', () => {
  let service: CaseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
