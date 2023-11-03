import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AudioEventRow, Case, Hearing, HearingAudio, HearingEvent } from '@darts-types/index';
import { CaseService } from '@services/case/case.service';
import { HearingService } from '@services/hearing/hearing.service';
import { Observable, of } from 'rxjs';

import { RequestTranscriptComponent } from './request-transcript.component';

describe('RequestTranscriptComponent', () => {
  let component: RequestTranscriptComponent;
  let fixture: ComponentFixture<RequestTranscriptComponent>;
  let caseService: CaseService;
  let hearingService: HearingService;
  let httpClientSpy: HttpClient;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
      params: {
        hearingId: 1,
      },
      queryParams: { tab: 'Transcripts' },
    },
  };

  const cd = of({ case_id: 1, case_number: '12345', courthouse: 'Reading', judges: ['Judy'] }) as Observable<Case>;
  const shd = of({
    id: 1,
    date: '2023-02-21',
    judges: ['Joseph', 'Judy'],
    courtroom: '3',
    transcript_count: 99,
  }) as Observable<Hearing>;
  const ahd = of([
    {
      id: 1,
      media_start_timestamp: '2023-07-31T02:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
    },
    {
      id: 2,
      media_start_timestamp: '2023-07-31T04:30:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
    },
    {
      id: 3,
      media_start_timestamp: '2023-07-31T05:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
    },
  ]) as Observable<HearingAudio[]>;

  const ehd = of([
    {
      id: 1,
      timestamp: '2023-07-31T02:32:24.620Z',
      name: 'Event 1',
      text: 'Text 1',
    },
    {
      id: 2,
      timestamp: '2023-07-31T04:30:24.620Z',
      name: 'Event 2',
      text: 'Text 2',
    },
    {
      id: 3,
      timestamp: '2023-07-31T05:32:24.620Z',
      name: 'Event 3',
      text: 'Text 3',
    },
  ]) as Observable<HearingEvent[]>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    caseService = new CaseService(httpClientSpy);
    hearingService = new HearingService(httpClientSpy);

    jest.spyOn(caseService, 'getCase').mockReturnValue(cd);
    jest.spyOn(caseService, 'getHearingById').mockReturnValue(shd);
    jest.spyOn(hearingService, 'getAudio').mockReturnValue(ahd);
    jest.spyOn(hearingService, 'getEvents').mockReturnValue(ehd);

    TestBed.configureTestingModule({
      imports: [RequestTranscriptComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: caseService },
        { provide: HearingService, useValue: hearingService },
      ],
    });
    fixture = TestBed.createComponent(RequestTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onNextStep', () => {
    it('should set validation errors to null if the form is valid', () => {
      component.transcriptionTypeFormControl.patchValue('3');
      component.urgencyFormControl.patchValue('2');
      component.onNextStep();
      expect(component.validationErrors).toEqual([]);
    });
    it('should set validation errors if the form is invalid', () => {
      const expectedValidationErrors = [
        {
          fieldId: 'transcription-type',
          message: 'Please select a transcription type',
        },
        {
          fieldId: 'urgency',
          message: 'Please select an urgency',
        },
      ];
      component.onNextStep();
      expect(component.validationErrors).toEqual(expectedValidationErrors);
    });
    it('should set validation errors if transcription-type is empty', () => {
      const expectedValidationErrors = [
        {
          fieldId: 'transcription-type',
          message: 'Please select a transcription type',
        },
      ];
      component.urgencyFormControl.patchValue('2');
      component.onNextStep();
      expect(component.validationErrors).toEqual(expectedValidationErrors);
    });
    it('should set validation errors if urgency is empty', () => {
      const expectedValidationErrors = [
        {
          fieldId: 'urgency',
          message: 'Please select an urgency',
        },
      ];
      component.transcriptionTypeFormControl.patchValue('3');
      component.onNextStep();
      expect(component.validationErrors).toEqual(expectedValidationErrors);
    });
    it('should set step to 2 if court log has been selected as the transcription type', () => {
      component.transcriptionTypeFormControl.patchValue('5');
      component.urgencyFormControl.patchValue('2');
      component.onNextStep();
      expect(component.step).toEqual(2);
    });
    it('should set step to 2 if specific times has been selected as the transcription type', () => {
      component.transcriptionTypeFormControl.patchValue('9');
      component.urgencyFormControl.patchValue('2');
      component.onNextStep();
      expect(component.step).toEqual(2);
    });
    it('should set step to 3 if anything other than court log and specified times has been selected', () => {
      component.transcriptionTypeFormControl.patchValue('3');
      component.urgencyFormControl.patchValue('2');
      component.onNextStep();
      expect(component.step).toEqual(3);
    });
  });

  describe('#mapEventsAndAudioToTable', () => {
    it('should map Hearing Audio Array to AudioEventRow Array', () => {
      let returnedData!: HearingAudio[];
      const expectedValue: AudioEventRow[] = [
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          name: 'Audio Recording',
        },
        {
          id: 2,
          media_start_timestamp: '2023-07-31T04:30:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          name: 'Audio Recording',
        },
        {
          id: 3,
          media_start_timestamp: '2023-07-31T05:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          name: 'Audio Recording',
        },
      ];

      hearingService.getAudio(1).subscribe((c) => {
        returnedData = c;
      });

      const result = component.mapEventsAndAudioToTable(returnedData);
      expect(result).toEqual(expectedValue);
    });
  });

  describe('#getValidationMessage', () => {
    describe('should return the validation message for', () => {
      it('transcription-type', () => {
        const expectedMessage = 'Please select a transcription type';
        component.onNextStep();
        expect(component.getValidationMessage('transcription-type')).toEqual(expectedMessage);
      });
      it('urgency', () => {
        const expectedMessage = 'Please select an urgency';
        component.onNextStep();
        expect(component.getValidationMessage('urgency')).toEqual(expectedMessage);
      });
    });
  });
});
