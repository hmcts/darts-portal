import { DatePipe } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { of } from 'rxjs';
import { ViewTranscriptComponent } from './view-transcript.component';

const transctiptionDetailsStub = {
  caseId: 1,
  hearingId: 2,
  transcriptionId: 3,
} as TranscriptionDetails;

const fileDownloadServiceStub = { downloadFile: jest.fn() };

const transcriptionServiceStub = {
  getTranscriptionDetails: jest.fn(),
};

describe('ViewTranscriptComponent', () => {
  let component: ViewTranscriptComponent;
  let fixture: ComponentFixture<ViewTranscriptComponent>;

  const setup = (transcriptionService: unknown, fileDownloadService: unknown) =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([], withComponentInputBinding()),
        { provide: TranscriptionService, useValue: transcriptionService },
        { provide: FileDownloadService, useValue: fileDownloadService },
        LuxonDatePipe,
        DatePipe,
      ],
    }).createComponent(ViewTranscriptComponent);

  it('calls getTranscriptionDetails with transcript id from url', () => {
    transcriptionServiceStub.getTranscriptionDetails.mockReturnValue(of(transctiptionDetailsStub));
    fixture = setup(transcriptionServiceStub, fileDownloadServiceStub);
    fixture.componentRef.setInput('transcriptId', '3');
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.transcriptId()).toEqual(3);
    expect(component.transcriptionService.getTranscriptionDetails).toHaveBeenCalledWith(3);
  });

  for (const { caseIdParam, hearingIdParam, transcriptIdParam, shouldRedirectToNotFound } of [
    {
      caseIdParam: 1,
      hearingIdParam: 2,
      transcriptIdParam: 3,
      shouldRedirectToNotFound: false,
    },
    {
      caseIdParam: 1,
      hearingIdParam: 3,
      transcriptIdParam: 3,
      shouldRedirectToNotFound: true,
    },
    {
      caseIdParam: 2,
      hearingIdParam: 2,
      transcriptIdParam: 3,
      shouldRedirectToNotFound: true,
    },
    {
      caseIdParam: 3,
      hearingIdParam: 3,
      transcriptIdParam: 3,
      shouldRedirectToNotFound: true,
    },
    {
      caseIdParam: 1,
      hearingIdParam: undefined,
      transcriptIdParam: 3,
      shouldRedirectToNotFound: false,
    },
    {
      caseIdParam: undefined,
      hearingIdParam: undefined,
      transcriptIdParam: 3,
      shouldRedirectToNotFound: false,
    },
  ]) {
    it(`redirect to 404 page if caseId and hearingId are incorrect in url`, () => {
      transcriptionServiceStub.getTranscriptionDetails.mockReturnValue(of(transctiptionDetailsStub));
      fixture = setup(transcriptionServiceStub, fileDownloadServiceStub);
      fixture.componentRef.setInput('transcriptId', transcriptIdParam);
      fixture.componentRef.setInput('caseId', caseIdParam);
      fixture.componentRef.setInput('hearingId', hearingIdParam);
      component = fixture.componentInstance;
      jest.spyOn(component.router, 'navigate');

      fixture.detectChanges();

      expect(component.transcript()).toEqual(transctiptionDetailsStub);

      if (shouldRedirectToNotFound) {
        expect(component.router.navigate).toHaveBeenCalledWith(['/page-not-found']);
      } else {
        expect(component.router.navigate).not.toHaveBeenCalled();
      }
    });
  }

  it('isTranscriptRejected() true if transcript status is REJECTED ', fakeAsync(() => {
    transcriptionServiceStub.getTranscriptionDetails.mockReturnValue(
      of({ ...transctiptionDetailsStub, status: 'REJECTED' })
    );
    fixture = setup(transcriptionServiceStub, fileDownloadServiceStub);
    fixture.componentRef.setInput('transcriptId', '3');
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.isTranscriptRejected()).toBe(true);
  }));

  it('isTranscriptRejected() false if transcript status is not REJECTED and is linked from Your Transcripts', () => {
    transcriptionServiceStub.getTranscriptionDetails.mockReturnValue(
      of({ ...transctiptionDetailsStub, status: 'APPROVED' })
    );
    fixture = setup(transcriptionServiceStub, fileDownloadServiceStub);
    fixture.componentRef.setInput('transcriptId', '3');
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.isTranscriptRejected()).toBe(false);
  });
});
