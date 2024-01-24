import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs/internal/observable/of';
import { UploadTranscriptComponent } from './upload-transcript.component';

const MOCK_TRANSCRIPTION_DETAILS: TranscriptionDetails = {
  caseId: 1,
  caseNumber: '123',
  courthouse: 'Swansea',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC', 'Ray Bob'],
  transcriptFileName: '',
  hearingDate: DateTime.fromISO('2023-06-26T00:00:00Z'),
  urgency: 'Overnight',
  requestType: 'Specified Times',
  transcriptionId: 1,
  transcriptionStartTs: DateTime.fromISO('2023-06-26T13:00:00Z'),
  transcriptionEndTs: DateTime.fromISO('2023-06-26T16:00:00Z'),
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
};

describe('UploadTranscriptComponent', () => {
  let component: UploadTranscriptComponent;
  let fixture: ComponentFixture<UploadTranscriptComponent>;
  let fakeTranscriptionService: TranscriptionService;
  let fakeActivatedRoute: ActivatedRoute;

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
    } as unknown as TranscriptionService;

    await TestBed.configureTestingModule({
      imports: [UploadTranscriptComponent, RouterTestingModule],
      providers: [
        { provide: TranscriptionService, useValue: fakeTranscriptionService },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        DatePipe,
        { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
        LuxonDatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    it('should navigate to complete screen', () => {
      const spy = jest.spyOn(component['router'], 'navigate');
      component.fileControl.patchValue(new File(['test'], 'test.txt', { type: 'text/plain' }));
      component.onComplete();
      expect(spy).toHaveBeenCalledWith(['/work', 1, 'complete']);
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
      expect(requestDetails.textContent).toContain('Hearing Date');
      expect(requestDetails.textContent).toContain('26 Jun 2023');
      expect(requestDetails.textContent).toContain('Request Type');
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

    it('render reporting restriction', () => {
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
});
