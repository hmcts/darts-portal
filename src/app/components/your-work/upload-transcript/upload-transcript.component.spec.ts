import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { of } from 'rxjs/internal/observable/of';
import { UploadTranscriptComponent } from './upload-transcript.component';

const MOCK_TRANSCRIPTION_DETAILS: TranscriptionDetails = {
  case_id: 1,
  case_number: '123',
  courthouse: 'Swansea',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC', 'Ray Bob'],
  transcript_file_name: '',
  hearing_date: '2023-06-26T00:00:00Z',
  urgency: 'Overnight',
  request_type: 'Specified Times',
  transcription_id: 1,
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
  is_manual: true,
  hearing_id: 1,
  requestor_comments: 'Please expedite my request',
  reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onComplete ', () => {
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

    it('render hearing details', () => {
      const hearingDetails = fixture.debugElement.queryAll(By.directive(DetailsTableComponent))[1].nativeElement;
      expect(hearingDetails.textContent).toContain('Hearing Date');
      expect(hearingDetails.textContent).toContain('26 Jun 2023');
      expect(hearingDetails.textContent).toContain('Request Type');
      expect(hearingDetails.textContent).toContain('Specified Times');
      expect(hearingDetails.textContent).toContain('Request ID');
      expect(hearingDetails.textContent).toContain('1');
      expect(hearingDetails.textContent).toContain('Request method');
      expect(hearingDetails.textContent).toContain('Manual');
      expect(hearingDetails.textContent).toContain('Urgency');
      expect(hearingDetails.textContent).toContain('Overnight');
      expect(hearingDetails.textContent).toContain('Audio for transcript');
      expect(hearingDetails.textContent).toContain('Start time 13:00:00 - End time 16:00:00');
      expect(hearingDetails.textContent).toContain('26 Jun 2023');
      expect(hearingDetails.textContent).toContain('Instructions');
      expect(hearingDetails.textContent).toContain('Please expedite my request');
      expect(hearingDetails.textContent).toContain('Judge approval');
      expect(hearingDetails.textContent).toContain('Yes');
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
