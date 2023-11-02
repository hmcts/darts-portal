import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TranscriptionService } from './transcription.service';

describe('TranscriptionService', () => {
  let service: TranscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TranscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
