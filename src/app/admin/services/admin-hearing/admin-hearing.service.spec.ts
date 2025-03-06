import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { AdminHearingService } from './admin-hearing.service';

describe('AdminHearingService', () => {
  let service: AdminHearingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [AdminHearingService, provideHttpClient()],
    });
    service = TestBed.inject(AdminHearingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
