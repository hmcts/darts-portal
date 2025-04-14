import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { ErrorMessageService } from '@services/error/error-message.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ApproveTranscriptComponent } from './approve-transcript.component';

describe('ApproveTranscriptComponent', () => {
  let component: ApproveTranscriptComponent;
  let fixture: ComponentFixture<ApproveTranscriptComponent>;
  let routerNavigateSpy: jest.SpyInstance;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 },
      },
      params: {
        transcriptId: 1,
      },
    },
  };

  const mockTranscriptionDetails: TranscriptionDetails = {
    caseId: 2,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    transcriptionObjectId: 1,
    courtroom: '1',
    status: 'Awaiting Authorisation',
    from: 'MoJ CH Swansea',
    received: DateTime.fromISO('2023-11-17T12:53:07.468Z'),
    requestorComments: 'Please expedite my request',
    rejectionReason: undefined,
    defendants: ['Defendant Dave', 'Defendant Bob'],
    judges: ['HHJ M. Hussain KC', 'Ray Bob'],
    transcriptFileName: 'C20220620001_0.docx',
    hearingDate: DateTime.fromISO('2023-11-08'),
    urgency: {
      transcription_urgency_id: 2,
      description: 'Standard',
      priority_order: 2,
    },
    requestType: 'Specified Times',
    transcriptionId: 123456789,
    transcriptionStartTs: DateTime.fromISO('2023-11-26T13:00:00Z'),
    transcriptionEndTs: DateTime.fromISO('2023-11-26T16:00:00Z'),
    isManual: false,
    hearingId: 1,
    caseReportingRestrictions: [
      {
        hearing_id: 1,
        event_id: 1,
        event_name: 'Section 4(2) of the Contempt of Court Act 1981',
        event_text: '',
        event_ts: '2023-09-01T09:00:00Z',
      },
    ],
    courthouseId: 1,
  };

  const fakeTranscriptionService = {
    getTranscriptionDetails: jest.fn(),
    getCaseDetailsFromTranscript: jest.fn(),
    getRequestDetailsFromTranscript: jest.fn(),
  };

  const setup = (mockTranscriptionDetails: TranscriptionDetails) => {
    fakeTranscriptionService.getTranscriptionDetails.mockReturnValue(of(mockTranscriptionDetails));

    TestBed.configureTestingModule({
      imports: [ApproveTranscriptComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DatePipe },
        { provide: TranscriptionService, useValue: fakeTranscriptionService },
        { provide: UserService, useValue: { userState: signal({ userId: 123 }) } },
      ],
    });

    fixture = TestBed.createComponent(ApproveTranscriptComponent);
    component = fixture.componentInstance;
    routerNavigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  };

  it('should create', () => {
    setup(mockTranscriptionDetails);
    expect(component).toBeTruthy();
  });

  it('should set caseDetails & requestDetails & reportingRestrictions', () => {
    setup(mockTranscriptionDetails);
    const caseDetails = {
      'Case ID': 'C20220620001',
      Courthouse: 'Swansea',
      'Judge(s)': ['HHJ M. Hussain KC', 'Ray Bob'],
      'Defendant(s)': ['Defendant Dave', 'Defendant Bob'],
    };

    const requestDetails = {
      'Hearing date': '08 Nov 2023',
      'Request type': 'Specified Times',
      'Request ID': 123456789,
      Urgency: 'Standard',
      'Audio for transcript': 'Start time 13:00:00 - End time 16:00:00',
      'Requested by': 'MoJ CH Swansea',
      Received: '17 Nov 2023 12:53:07',
      Instructions: 'Please expedite my request',
      'Judge approval': 'Yes',
    };

    jest.spyOn(fakeTranscriptionService, 'getCaseDetailsFromTranscript').mockReturnValue(caseDetails);
    jest.spyOn(fakeTranscriptionService, 'getRequestDetailsFromTranscript').mockReturnValue(requestDetails);

    const reportingRestrictions = [
      {
        hearing_id: 1,
        event_id: 1,
        event_name: 'Section 4(2) of the Contempt of Court Act 1981',
        event_text: '',
        event_ts: '2023-09-01T09:00:00Z',
      },
    ];

    let caseObj;
    let requestObj;
    let reporting;

    component.vm$.subscribe((transformedData) => {
      caseObj = transformedData.caseDetails;
      requestObj = transformedData.requestDetails;
      reporting = transformedData.reportingRestrictions;
    });

    expect(caseObj).toEqual(caseDetails);
    expect(requestObj).toEqual(requestDetails);
    expect(reporting).toEqual(reportingRestrictions);
  });

  it('should clear error message on destroy', () => {
    setup(mockTranscriptionDetails);
    const errorMessageService = TestBed.inject(ErrorMessageService);
    const clearErrorMessageSpy = jest.spyOn(errorMessageService, 'clearErrorMessage');
    component.ngOnDestroy();
    expect(clearErrorMessageSpy).toHaveBeenCalled();
  });

  it('should handle incoming error', () => {
    setup(mockTranscriptionDetails);
    const errors = [{ fieldId: 'Test', message: 'Message' }];
    component.handleRejectError(errors);
    expect(component.approvalErrors).toEqual(errors);
  });

  it('redirect to forbidden if user is requester', () => {
    setup({ ...mockTranscriptionDetails, requestor: { userId: 123 } });
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/forbidden']);
  });

  it('redirect to not-found if transcript status is not Awaiting Authorisation', () => {
    setup({ ...mockTranscriptionDetails, status: 'Approved' });
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/not-found']);
  });

  it('does not redirect if user is not requester and transcript is Awaiting Authorisation', () => {
    setup(mockTranscriptionDetails);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });
});
