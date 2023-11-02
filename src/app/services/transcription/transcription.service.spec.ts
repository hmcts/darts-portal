import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranscriptionType } from '@darts-types/transcription-type.interface';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';
import { Observable, of } from 'rxjs';

import { TranscriptionService } from './transcription.service';

describe('TranscriptionService', () => {
  let service: TranscriptionService;

  const mockTranscriptionTypes: Observable<TranscriptionType[]> = of([
    { trt_id: 1, description: 'Sentencing Remarks' },
    { trt_id: 2, description: 'Summing up (inc. verdict)' },
    { trt_id: 3, description: 'Antecedents' },
    { trt_id: 4, description: 'Argument and submission of ruling' },
    { trt_id: 5, description: 'Court log' },
    { trt_id: 6, description: 'Mitigation' },
    { trt_id: 7, description: 'Proceedings after verdict' },
    { trt_id: 8, description: 'Proposed opening of facts' },
    { trt_id: 9, description: 'Specified times' },
    { trt_id: 999, description: 'Other' },
  ]);

  const mockTranscriptionUrgencies: Observable<TranscriptionUrgency[]> = of([
    { tru_id: 1, description: 'Overnight' },
    { tru_id: 2, description: '3 working days' },
    { tru_id: 3, description: '7 working days' },
    { tru_id: 4, description: '12 working days' },
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TranscriptionService);

    jest.spyOn(service, 'getUrgencies').mockReturnValue(mockTranscriptionUrgencies);
    jest.spyOn(service, 'getTranscriptionTypes').mockReturnValue(mockTranscriptionTypes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getUrgencies', () => {
    let result!: TranscriptionUrgency[];
    const expectedValue: TranscriptionUrgency[] = [
      { tru_id: 1, description: 'Overnight' },
      { tru_id: 2, description: '3 working days' },
      { tru_id: 3, description: '7 working days' },
      { tru_id: 4, description: '12 working days' },
    ];

    service.getUrgencies().subscribe((c) => {
      result = c;
    });

    expect(result).toEqual(expectedValue);
  });
  it('#getTranscriptionTypes', () => {
    let result!: TranscriptionType[];
    const expectedValue: TranscriptionType[] = [
      { trt_id: 1, description: 'Sentencing Remarks' },
      { trt_id: 2, description: 'Summing up (inc. verdict)' },
      { trt_id: 3, description: 'Antecedents' },
      { trt_id: 4, description: 'Argument and submission of ruling' },
      { trt_id: 5, description: 'Court log' },
      { trt_id: 6, description: 'Mitigation' },
      { trt_id: 7, description: 'Proceedings after verdict' },
      { trt_id: 8, description: 'Proposed opening of facts' },
      { trt_id: 9, description: 'Specified times' },
      { trt_id: 999, description: 'Other' },
    ];

    service.getTranscriptionTypes().subscribe((c) => {
      result = c;
    });

    expect(result).toEqual(expectedValue);
  });
});
