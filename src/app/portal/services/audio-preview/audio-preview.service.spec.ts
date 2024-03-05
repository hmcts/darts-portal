import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioPreviewService } from './audio-preview.service';

describe('AudioPreviewService', () => {
  let service: AudioPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AudioPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
