import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AudioEventRow, Case, Hearing, HearingAudio, HearingEvent } from '@portal-types/index';
import { CaseService } from '@services/case/case.service';
import { HearingService } from '@services/hearing/hearing.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';

import { RequestTranscriptComponent } from './request-transcript.component';

describe('RequestTranscriptComponent', () => {
  let component: RequestTranscriptComponent;
  let fixture: ComponentFixture<RequestTranscriptComponent>;
  let fakeCaseService: Partial<CaseService>;
  let fakeHearingService: Partial<HearingService>;
  let fakeTranscriptionService: Partial<TranscriptionService>;

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

  const cd = of({ id: 1, number: '12345', courthouse: 'Reading', judges: ['Judy'] }) as Observable<Case>;
  const shd = of({
    id: 1,
    date: DateTime.fromISO('2023-02-21'),
    judges: ['Joseph', 'Judy'],
    courtroom: '3',
    transcriptCount: 99,
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
    fakeCaseService = { getCase: jest.fn(), getHearingById: jest.fn() };
    fakeHearingService = { getAudio: jest.fn(), getEvents: jest.fn() };
    fakeTranscriptionService = {
      postTranscriptionRequest: jest.fn(),
      getUrgencies: jest.fn(),
      getTranscriptionTypes: jest.fn(),
    };

    jest.spyOn(fakeCaseService, 'getCase').mockReturnValue(cd);
    jest.spyOn(fakeCaseService, 'getHearingById').mockReturnValue(shd);
    jest.spyOn(fakeHearingService, 'getAudio').mockReturnValue(ahd);
    jest.spyOn(fakeHearingService, 'getEvents').mockReturnValue(ehd);

    TestBed.configureTestingModule({
      imports: [RequestTranscriptComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: fakeCaseService },
        { provide: HearingService, useValue: fakeHearingService },
        { provide: TranscriptionService, useValue: fakeTranscriptionService },
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

      component.hearingService.getAudio(1).subscribe((c) => {
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

  describe('#onConfirm', () => {
    it('should set step to 4', () => {
      jest.spyOn(fakeTranscriptionService, 'postTranscriptionRequest').mockReturnValue(of({ transcription_id: 1 }));
      component.onConfirm('test');
      expect(component.step).toEqual(4);
    });
    it('should call postTranscriptionRequest', () => {
      jest.spyOn(fakeTranscriptionService, 'postTranscriptionRequest').mockReturnValue(of({ transcription_id: 1 }));
      component.audioTimes = {
        startTime: DateTime.fromISO('2023-02-21T13:00:00Z'),
        endTime: DateTime.fromISO('2023-02-21T18:00:00Z'),
      };
      component.transcriptionTypeFormControl.patchValue('3');
      component.urgencyFormControl.patchValue('2');
      component.hearingId = 1;
      component.caseId = 1;

      const expectedRequestObject = {
        case_id: 1,
        comment: 'test',
        end_date_time: '2023-02-21T18:00:00Z',
        hearing_id: 1,
        start_date_time: '2023-02-21T13:00:00Z',
        transcription_type_id: 3,
        transcription_urgency_id: 2,
      };

      component.onConfirm('test');
      expect(fakeTranscriptionService.postTranscriptionRequest).toHaveBeenCalledWith(expectedRequestObject);
    });
  });

  describe('#onRequestTimeContinue', () => {
    it('should set step to 3', () => {
      component.onRequestTimeContinue({
        startTime: DateTime.fromISO('2023-02-21T13:00:00Z'),
        endTime: DateTime.fromISO('2023-02-21T18:00:00Z'),
      });
      expect(component.step).toEqual(3);
    });
    it('should set audioTimes', () => {
      component.onRequestTimeContinue({
        startTime: DateTime.fromISO('2023-02-21T13:00:00Z'),
        endTime: DateTime.fromISO('2023-02-21T18:00:00Z'),
      });
      expect(component.audioTimes).toEqual({
        startTime: DateTime.fromISO('2023-02-21T13:00:00Z'),
        endTime: DateTime.fromISO('2023-02-21T18:00:00Z'),
      });
    });
  });

  describe('#onRequestTimeCancel', () => {
    it('should set step to 1', () => {
      component.onRequestTimeCancel();
      expect(component.step).toEqual(1);
    });
    it('should set audioTimes to undefined', () => {
      component.onRequestTimeCancel();
      expect(component.audioTimes).toEqual(undefined);
    });
  });

  describe('#onConfirmationCancel', () => {
    it('should set step to 2 if transcription type is court log', () => {
      component.transcriptionTypeFormControl.patchValue('5');
      component.onConfirmationCancel();
      expect(component.step).toEqual(2);
    });
    it('should set step to 2 if transcription type is specified times', () => {
      component.transcriptionTypeFormControl.patchValue('9');
      component.onConfirmationCancel();
      expect(component.step).toEqual(2);
    });
    it('should set step to 1 if transcription type is anything other than court log or specified times', () => {
      component.transcriptionTypeFormControl.patchValue('3');
      component.onConfirmationCancel();
      expect(component.step).toEqual(1);
    });
  });

  describe('#onConfirm', () => {
    it('should set step to 4', () => {
      jest.spyOn(fakeTranscriptionService, 'postTranscriptionRequest').mockReturnValue(of({ transcription_id: 1 }));
      component.onConfirm('test');
      expect(component.step).toEqual(4);
    });

    it('should call postTranscriptionRequest', () => {
      jest.spyOn(fakeTranscriptionService, 'postTranscriptionRequest').mockReturnValue(of({ transcription_id: 1 }));
      component.audioTimes = {
        startTime: DateTime.fromISO('2023-02-21T13:00:00Z'),
        endTime: DateTime.fromISO('2023-02-21T18:00:00Z'),
      };
      component.transcriptionTypeFormControl.patchValue('3');
      component.urgencyFormControl.patchValue('2');
      component.hearingId = 1;
      component.caseId = 1;

      const expectedRequestObject = {
        case_id: 1,
        comment: 'test',
        end_date_time: '2023-02-21T18:00:00Z',
        hearing_id: 1,
        start_date_time: '2023-02-21T13:00:00Z',
        transcription_type_id: 3,
        transcription_urgency_id: 2,
      };

      component.onConfirm('test');
      expect(fakeTranscriptionService.postTranscriptionRequest).toHaveBeenCalledWith(expectedRequestObject);
    });
  });
});
