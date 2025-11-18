import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { UploadTranscriptComponent } from './upload-transcript.component';

const MOCK_TRANSCRIPTION_DETAILS: TranscriptionDetails = {
  caseId: 1,
  caseNumber: '123',
  courthouse: 'Swansea',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC', 'Ray Bob'],
  transcriptFileName: '',
  hearingDate: DateTime.fromISO('2023-06-26T00:00:00'),
  urgency: {
    transcription_urgency_id: 2,
    description: 'Overnight',
    priority_order: 2,
  },
  requestType: 'Specified Times',
  transcriptionId: 1,
  transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00'),
  transcriptionEndTs: DateTime.fromISO('2023-06-26T16:00:00'),
  transcriptionObjectId: 1,
  courtroom: '1',
  isManual: true,
  hearingId: 1,
  requestorComments: 'Please expedite my request',
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

const MOCK_TABLE_DETAILS = {
  reportingRestrictions: [
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Section 4(2) of the Contempt of Court Act 1981',
      event_text: '',
      event_ts: '2023-08-07T09:00:00Z',
    },
  ],
  caseDetails: {
    'Case ID': '123',
    Courthouse: 'Swansea',
    'Judge(s)': ['HHJ M. Hussain KC', 'Ray Bob'],
    'Defendant(s)': ['Defendant Dave', 'Defendant Bob'],
  },
  hearingDetails: {
    'Hearing date': '26 Jun 2023',
    'Request type': 'Specified Times',
    'Request method': 'Manual',
    'Request ID': 789,
    Urgency: 'Overnight',
    'Audio for transcript': 'Start time 13:00:00 - End time 16:00:00',
    From: 'Joe Smith',
    Received: '17 Nov 2023 12:53:07',
    Instructions: 'Please expedite my request',
    'Judge approval': 'Yes',
  },
  hearingId: 1,
  caseId: 2,
  getAudioQueryParams: {
    startTime: '14:00:00',
    endTime: '17:00:00',
  },
};

describe('UploadTranscriptComponent', () => {
  let component: UploadTranscriptComponent;
  let fixture: ComponentFixture<UploadTranscriptComponent>;
  let fakeTranscriptionService: TranscriptionService;
  let fakeActivatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    fakeActivatedRoute = {
      snapshot: {
        params: {
          requestId: 1,
        },
      },
    } as unknown as ActivatedRoute;

    fakeTranscriptionService = {
      getTranscriptionDetails: jest.fn().mockReturnValue(of(MOCK_TRANSCRIPTION_DETAILS)),
      uploadTranscript: jest.fn().mockReturnValue(of({})),
      completeTranscriptionRequest: jest.fn().mockReturnValue(of({})),
      unfulfillTranscriptionRequest: jest.fn().mockReturnValue(of({})),
      getAssignDetailsFromTranscript: jest.fn().mockReturnValue(MOCK_TABLE_DETAILS),
    } as unknown as TranscriptionService;

    await TestBed.configureTestingModule({
      imports: [UploadTranscriptComponent],
      providers: [
        { provide: TranscriptionService, useValue: fakeTranscriptionService },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        DatePipe,
        LuxonDatePipe,
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(UploadTranscriptComponent);
    component = fixture.componentInstance;
    component.requestId = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Outcome: dynamic submit label', () => {
    it('shows "Attach file and complete" when manual + complete', () => {
      component.isManualRequest = true;
      component.outcomeControl.setValue('complete');
      expect(component.submitLabel).toBe('Attach file and complete');
    });

    it('shows "Mark as unfulfilled" when unfulfilled', () => {
      component.outcomeControl.setValue('unfulfilled');
      expect(component.submitLabel).toBe('Mark as unfulfilled');
    });

    it('shows "Complete transcript request" when automated', () => {
      component.isManualRequest = false;
      component.outcomeControl.setValue('complete');
      expect(component.submitLabel).toBe('Complete transcript request');
    });
  });

  describe('Outcome: switching to Unfulfilled', () => {
    beforeEach(() => {
      component.isManualRequest = true;
      component.outcomeControl.setValue('complete');
      component.onOutcomeChanged();
    });

    it('clears the selected file when switching to Unfulfilled', () => {
      const file = new File(['x'], 'a.txt', { type: 'text/plain' });
      component.fileControl.setValue(file);
      component.outcomeControl.setValue('unfulfilled');
      component.onOutcomeChanged();
      expect(component.fileControl.value).toBeNull();
    });

    it('removes "required" validator when Unfulfilled', () => {
      component.outcomeControl.setValue('unfulfilled');
      component.onOutcomeChanged();
      component.fileControl.setValue(null);
      component.fileControl.updateValueAndValidity();
      expect(component.fileControl.valid).toBeTruthy();
      expect(component.fileControl.hasError('required')).toBeFalsy();
    });
  });

  describe('Unfulfilled payload mapping', () => {
    beforeEach(() => {
      component.outcomeControl.setValue('unfulfilled');
    });

    it('sends display label for non-"other" reasons', () => {
      component.reasonControl.setValue('no_audio');
      component.onComplete();

      expect(fakeTranscriptionService.unfulfillTranscriptionRequest as jest.Mock).toHaveBeenCalledWith(
        1,
        'No audio / white noise'
      );
    });

    it('sends details text when reason is "other"', () => {
      component.reasonControl.setValue('other');
      component.detailsControl.setValue('Mic failure, no capture');
      component.onComplete();

      expect(fakeTranscriptionService.unfulfillTranscriptionRequest as jest.Mock).toHaveBeenCalledWith(
        1,
        'Other - Mic failure, no capture'
      );
    });
  });

  describe('Template visibility', () => {
    it('hides file upload when outcome is Unfulfilled', () => {
      component.isManualRequest = true;
      component.outcomeControl.setValue('unfulfilled');
      fixture.detectChanges();

      const fileUpload = fixture.debugElement.query(By.directive(FileUploadComponent));
      expect(fileUpload).toBeFalsy();
    });

    it('shows comment textarea only when reason is "other"', () => {
      component.outcomeControl.setValue('unfulfilled');
      component.reasonControl.setValue('no_audio');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#details'))).toBeFalsy();

      component.reasonControl.setValue('other');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#details'))).toBeTruthy();
    });
  });

  describe('UploadTranscriptComponent — fileControl validators', () => {
    beforeEach(() => {
      component.isManualRequest = true;
      component.outcomeControl.setValue('complete');
      component.onOutcomeChanged();
    });

    it('should set fileControl value when a file is selected', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.value).toEqual(file);
    });

    it('should mark fileControl as invalid when no file is selected', () => {
      const fileControl = component.fileControl;
      fileControl.setValue(null);
      expect(fileControl.invalid).toBe(true);
    });

    it('should mark fileControl as valid when a file is selected', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.valid).toBe(true);
    });

    it('should mark fileControl as required', () => {
      const fileControl = component.fileControl;
      fileControl.setValue(null);
      expect(fileControl.hasError('required')).toBe(true);
    });

    it('should mark fileControl as invalid when file size exceeds the maximum limit', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 12 * 1024 * 1024 }); // 12MB file size
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.hasError('maxFileSize')).toBe(true);
    });

    it('should mark fileControl as valid when file size is within the maximum limit', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileControl = component.fileControl;
      fileControl.setValue(file);
      expect(fileControl.valid).toBe(true);
    });
  });

  describe('validation errors', () => {
    it('set error message when fileControl is required', () => {
      component.onComplete();
      expect(component.errors[0].message).toBe('You must upload a file to complete this request');
    });
    it('set error message when filesize is too large', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 12 * 1024 * 1024 }); // 12MB file size
      component.fileControl.setValue(file);
      component.onComplete();
      expect(component.errors[0].message).toBe('The selected file must be smaller than 10MB.');
    });
  });

  describe('#onComplete ', () => {
    it('set is sumbitted to true and update form value and validity', () => {
      const updateValueAndValiditySpy = jest.spyOn(component.fileControl, 'updateValueAndValidity');

      component.onComplete();

      expect(component.isSubmitted).toBe(true);
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });

    it('should call uploadTranscript if isManualRequest is true', () => {
      component.isManualRequest = true;
      component.fileControl.setValue(new File(['test'], 'test.txt', { type: 'text/plain' }));
      component.onComplete();
      expect(fakeTranscriptionService.uploadTranscript).toHaveBeenCalled();
    });

    it('should call completeTranscriptionRequest if isManualRequest is false', () => {
      component.isManualRequest = false;
      component.onComplete();
      expect(fakeTranscriptionService.completeTranscriptionRequest).toHaveBeenCalled();
    });

    it('should not call uploadTranscript if isManualRequest is false', () => {
      component.isManualRequest = false;
      component.fileControl.setValue(new File(['test'], 'test.txt', { type: 'text/plain' }));
      component.onComplete();
      expect(fakeTranscriptionService.uploadTranscript).not.toHaveBeenCalled();
    });

    it('should not call completeTranscriptionRequest if isManualRequest is true', () => {
      component.isManualRequest = true;
      component.onComplete();
      expect(fakeTranscriptionService.completeTranscriptionRequest).not.toHaveBeenCalled();
    });

    it('should not call uploadTranscript if fileControl is invalid', () => {
      component.isManualRequest = true;
      component.fileControl.setValue(null);
      component.onComplete();
      expect(fakeTranscriptionService.uploadTranscript).not.toHaveBeenCalled();
    });

    it('handles upload errors', () => {
      fakeTranscriptionService.uploadTranscript = jest.fn().mockReturnValue(throwError(() => new Error('Mock error')));
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      component.fileControl.setValue(file);
      component.onComplete();
      expect(fakeTranscriptionService.uploadTranscript).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/internal-error']);
    });
  });

  describe('Navigation', () => {
    it('navigates to /work/:id/complete after successful manual upload', () => {
      component.isManualRequest = true;
      component.fileControl.setValue(new File(['x'], 'a.txt', { type: 'text/plain' }));
      const navSpy = jest.spyOn(component['router'], 'navigate');
      component.onComplete();
      expect(navSpy).toHaveBeenCalledWith(['/work', 1, 'complete']);
    });

    it('navigates to /work/:id/unfulfilled after unfulfilled submit', () => {
      component.outcomeControl.setValue('unfulfilled');
      component.reasonControl.setValue('inaudible');
      const navSpy = jest.spyOn(component['router'], 'navigate');
      component.onComplete();

      expect(navSpy).toHaveBeenCalledWith(['/work', 1, 'unfulfilled']);
    });
  });

  describe('Template rendering', () => {
    it('render case details', () => {
      const caseDetails = fixture.debugElement.queryAll(By.directive(DetailsTableComponent))[0].nativeElement;
      expect(caseDetails.textContent).toContain('Case ID');
      expect(caseDetails.textContent).toContain('123');
      expect(caseDetails.textContent).toContain('Courthouse');
      expect(caseDetails.textContent).toContain('Swansea');
      expect(caseDetails.textContent).toContain('Judge(s)');
      expect(caseDetails.textContent).toContain('HHJ M. Hussain KC');
      expect(caseDetails.textContent).toContain('Defendant(s)');
      expect(caseDetails.textContent).toContain('Defendant Dave');
    });

    it('render request details', () => {
      const requestDetails = fixture.debugElement.queryAll(By.directive(DetailsTableComponent))[1].nativeElement;
      expect(requestDetails.textContent).toContain('Hearing date');
      expect(requestDetails.textContent).toContain('26 Jun 2023');
      expect(requestDetails.textContent).toContain('Request type');
      expect(requestDetails.textContent).toContain('Specified Times');
      expect(requestDetails.textContent).toContain('Request ID');
      expect(requestDetails.textContent).toContain('1');
      expect(requestDetails.textContent).toContain('Request method');
      expect(requestDetails.textContent).toContain('Manual');
      expect(requestDetails.textContent).toContain('Urgency');
      expect(requestDetails.textContent).toContain('Overnight');
      expect(requestDetails.textContent).toContain('Audio for transcript');
      expect(requestDetails.textContent).toContain('Start time 13:00:00 - End time 16:00:00');
      expect(requestDetails.textContent).toContain('26 Jun 2023');
      expect(requestDetails.textContent).toContain('Instructions');
      expect(requestDetails.textContent).toContain('Please expedite my request');
      expect(requestDetails.textContent).toContain('Judge approval');
      expect(requestDetails.textContent).toContain('Yes');
    });

    it('render reporting restrictions', () => {
      const reportingRestriction = fixture.debugElement.query(
        By.directive(ReportingRestrictionComponent)
      ).nativeElement;
      expect(reportingRestriction.textContent).toContain('Section 4(2) of the Contempt of Court Act 1981');
    });

    it('should render upload transcript button', () => {
      const uploadTranscriptButton = fixture.debugElement.query(By.directive(FileUploadComponent)).nativeElement;
      expect(uploadTranscriptButton.textContent).toContain('Upload transcript');
    });

    it('should not render upload transcript button if isManualRequest is false', () => {
      component.isManualRequest = false;
      fixture.detectChanges();
      const uploadTranscriptButton = fixture.debugElement.query(By.directive(FileUploadComponent));
      expect(uploadTranscriptButton).toBeFalsy();
    });
  });

  describe('getErrorMessage', () => {
    it('returns null when errors is null/undefined/empty', () => {
      const empty: ValidationErrors = {};
      expect(component.getErrorMessage('file', null)).toBeNull();
      expect(component.getErrorMessage('file', undefined)).toBeNull();
      expect(component.getErrorMessage('file', empty)).toBeNull();
    });

    it('returns the mapped message for a single known key (required)', () => {
      const errors: ValidationErrors = { required: true };
      const msg = component.getErrorMessage('file', errors);
      expect(msg).toBe(component.UploadTranscriptErrorMessages.file.required);
    });

    it('returns the mapped message for a single known key (maxlength)', () => {
      const errors: ValidationErrors = { maxlength: { requiredLength: 200, actualLength: 210 } };
      const msg = component.getErrorMessage('details', errors);
      expect(msg).toBe(component.UploadTranscriptErrorMessages.details.maxlength);
    });

    it('returns the mapped message for a single known key (custom maxFileSize)', () => {
      const errors: ValidationErrors = { maxFileSize: { max: 10 } };
      const msg = component.getErrorMessage('file', errors);
      expect(msg).toBe(component.UploadTranscriptErrorMessages.file.maxFileSize);
    });

    it('returns the FIRST mapped message when multiple keys are present (order matters)', () => {
      // Insertion order determines Object.keys order for non-integer keys
      const errors1: ValidationErrors = {
        maxlength: { requiredLength: 200, actualLength: 250 },
        required: true,
      };
      expect(component.getErrorMessage('details', errors1)).toBe(
        component.UploadTranscriptErrorMessages.details.maxlength
      );

      const errors2: ValidationErrors = {
        required: true,
        maxlength: { requiredLength: 200, actualLength: 250 },
      };
      expect(component.getErrorMessage('details', errors2)).toBe(
        component.UploadTranscriptErrorMessages.details.required
      );
    });

    it('skips unknown keys and returns the first known message', () => {
      const errors: ValidationErrors = {
        someUnknownKey: true,
        maxlength: { requiredLength: 200, actualLength: 205 },
      };
      expect(component.getErrorMessage('details', errors)).toBe(
        component.UploadTranscriptErrorMessages.details.maxlength
      );
    });

    it('returns null when only unknown keys are present', () => {
      const errors: ValidationErrors = { totallyUnknown: true };
      expect(component.getErrorMessage('reason', errors)).toBeNull();
    });
  });
});
