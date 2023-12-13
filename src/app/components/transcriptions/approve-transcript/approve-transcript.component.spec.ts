import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ErrorMessageService } from '@services/error/error-message.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { of } from 'rxjs';
import { ApproveTranscriptComponent } from './approve-transcript.component';

describe('ApproveTranscriptComponent', () => {
  let component: ApproveTranscriptComponent;
  let fixture: ComponentFixture<ApproveTranscriptComponent>;
  let fakeTranscriptionService: Partial<TranscriptionService>;
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

  const transcriptionDetail = of({
    case_id: 2,
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    case_number: 'C20220620001',
    courthouse: 'Swansea',
    status: 'Rejected',
    from: 'MoJ CH Swansea',
    received: '2023-11-17T12:53:07.468Z',
    requestor_comments: 'Please expedite my request',
    defendants: ['Defendant Dave', 'Defendant Bob'],
    judges: ['HHJ M. Hussain KC\t', 'Ray Bob'],
    transcript_file_name: 'C20220620001_0.docx',
    hearing_date: '2023-11-08',
    urgency: 'Standard',
    request_type: 'Specified Times',
    transcription_id: 123456789,
    transcription_start_ts: '2023-11-26T13:00:00Z',
    transcription_end_ts: '2023-11-26T16:00:00Z',
    is_manual: false,
    hearing_id: 1,
  });

  beforeEach(async () => {
    fakeTranscriptionService = {
      getTranscriptionDetails: jest.fn(),
      getCaseDetailsFromTranscript: jest.fn(),
      getRequestDetailsFromTranscript: jest.fn(),
    };

    jest.spyOn(fakeTranscriptionService, 'getTranscriptionDetails').mockReturnValue(transcriptionDetail);

    await TestBed.configureTestingModule({
      imports: [ApproveTranscriptComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DatePipe },
        { provide: TranscriptionService, useValue: fakeTranscriptionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set caseDetails & requestDetails & reportingRestriction', () => {
    const caseDetails = {
      'Case ID': 'C20220620001',
      Courthouse: 'Swansea',
      'Judge(s)': ['HHJ M. Hussain KC\t', 'Ray Bob'],
      'Defendant(s)': ['Defendant Dave', 'Defendant Bob'],
    };

    const requestDetails = {
      'Hearing Date': '08 Nov 2023',
      'Request Type': 'Specified Times',
      'Request ID': 123456789,
      Urgency: 'Standard',
      'Audio for transcript': 'Start time 13:00:00 - End time 16:00:00',
      From: 'MoJ CH Swansea',
      Received: '17 Nov 2023 12:53:07',
      Instructions: 'Please expedite my request',
      'Judge approval': 'Yes',
    };

    jest.spyOn(fakeTranscriptionService, 'getCaseDetailsFromTranscript').mockReturnValue(caseDetails);
    jest.spyOn(fakeTranscriptionService, 'getRequestDetailsFromTranscript').mockReturnValue(requestDetails);

    const reportingRestriction = 'Section 4(2) of the Contempt of Court Act 1981';

    let caseObj;
    let requestObj;
    let reporting;

    component.vm$.subscribe((transformedData) => {
      caseObj = transformedData.caseDetails;
      requestObj = transformedData.requestDetails;
      reporting = transformedData.reportingRestriction;
    });

    expect(caseObj).toEqual(caseDetails);
    expect(requestObj).toEqual(requestDetails);
    expect(reporting).toEqual(reportingRestriction);
  });

  it('should clear error message on destroy', () => {
    const errorMessageService = TestBed.inject(ErrorMessageService);
    const clearErrorMessageSpy = jest.spyOn(errorMessageService, 'clearErrorMessage');
    component.ngOnDestroy();
    expect(clearErrorMessageSpy).toHaveBeenCalled();
  });

  it('should handle incoming error', () => {
    const errors = [{ fieldId: 'Test', message: 'Message' }];
    component.handleRejectError(errors);
    expect(component.approvalErrors).toEqual(errors);
  });
});
