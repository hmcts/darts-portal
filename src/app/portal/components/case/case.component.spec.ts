import { DatePipe } from '@angular/common';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AnnotationsData, Case, CaseEvent, Hearing, TranscriptData } from '@portal-types/index';
import { AnnotationService } from '@services/annotation/annotation.service';
import { CaseService } from '@services/case/case.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { Observable, of, throwError } from 'rxjs';
import { CaseComponent } from './case.component';

describe('CaseComponent', () => {
  let fixture: ComponentFixture<CaseComponent>;
  let fakeUserService: Partial<UserService>;
  let fakeFileDownloadService: Partial<FileDownloadService>;

  const fakeAnnotationService = {
    downloadAnnotationDocument: jest.fn().mockReturnValue(of({})),
    downloadAnnotationTemplate: jest.fn().mockReturnValue(of({})),
    deleteAnnotation: jest.fn().mockReturnValue(of({})),
  };

  const mockCaseFile: Case = {
    id: 1,
    courthouse: 'Swansea',
    courthouseId: 1,
    number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    retainUntil: '2023-08-10T11:23:24.858Z',
  };

  const mockEvents: CaseEvent[] = [
    {
      id: 1,
      hearingId: 1,
      hearingDate: DateTime.fromISO('2023-09-01'),
      timestamp: DateTime.fromISO('2023-09-01T12:00:00'),
      name: 'Hearing',
      text: 'Hearing 1',
    },
  ];

  const mockCaseFileNoCourthouseId: Case = {
    id: 1,
    courthouse: 'Swansea',
    number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    retainUntil: '2023-08-10T11:23:24.858Z',
  };

  const mockSingleCaseTwoHearings: Observable<Hearing[]> = of([
    {
      id: 1,
      date: DateTime.fromISO('2023-09-01'),
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcriptCount: 1,
    },
  ]);

  const mockTranscript: Observable<TranscriptData[]> = of([
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Rejected',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Requested',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Complete',
    },
  ]);

  const mockAnnotation: AnnotationsData[] = [
    {
      annotation_id: 1,
      hearing_id: 123,
      hearing_date: '2023-12-14',
      annotation_ts: '2023-12-15T12:00:00.000Z',
      annotation_text: 'A summary notes of this annotation...',
      annotation_documents: [
        {
          annotation_document_id: 1,
          file_name: 'Annotation.doc',
          file_type: 'DOC',
          uploaded_by: 'Mr User McUserFace',
          uploaded_ts: '2023-12-15T12:00:00.000Z',
        },
      ],
    },
  ];

  const caseServiceMock = {
    getCase: jest.fn().mockReturnValue(of(mockCaseFile)),
    getCaseHearings: jest.fn().mockReturnValue(mockSingleCaseTwoHearings),
    getCaseTranscripts: jest.fn().mockReturnValue(mockTranscript),
    getCaseAnnotations: jest.fn().mockReturnValue(mockAnnotation),
    getCaseEvents: jest.fn().mockReturnValue(of([])),
  };

  const caseServiceMockError = {
    getCase: jest
      .fn()
      .mockReturnValue(
        of({ ...mockCaseFile, isDataAnonymised: true, dataAnonymisedAt: DateTime.fromISO('2023-08-10T11:23:24.858Z') })
      ),
    getCaseHearings: jest.fn().mockReturnValue(throwError(() => ({ status: 404 }) as unknown as HttpResponse<void>)),
    getCaseTranscripts: jest.fn().mockReturnValue(throwError(() => ({ status: 404 }) as unknown as HttpResponse<void>)),
    getCaseAnnotations: jest.fn().mockReturnValue(throwError(() => ({ status: 404 }) as unknown as HttpResponse<void>)),
    getCaseEvents: jest.fn().mockReturnValue(throwError(() => ({ status: 404 }) as unknown as HttpResponse<void>)),
  };

  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
      queryParams: { tab: 'Transcripts' },
    },
  };

  fakeUserService = {
    isSuperUser: jest.fn(() => true),
    isTranscriber: jest.fn(() => false),
    isJudge: jest.fn(() => true),
    isApprover: jest.fn(() => false),
    isRequester: jest.fn(() => false),
    isAdmin: jest.fn(() => true),
    isTranslationQA: jest.fn(() => false),
    isCourthouseJudge: jest.fn(() => false),
  };

  fakeFileDownloadService = {
    saveAs: jest.fn(),
  };

  const setup = (throwError = false) => {
    return TestBed.configureTestingModule({
      imports: [CaseComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CaseService, useValue: !throwError ? caseServiceMock : caseServiceMockError },
        { provide: UserService, useValue: fakeUserService },
        { provide: AnnotationService, useValue: fakeAnnotationService },
        { provide: FileDownloadService, useValue: fakeFileDownloadService },
        { provide: DatePipe },
      ],
    }).createComponent(CaseComponent);
  };

  describe('Expired case', () => {
    let component: CaseComponent;

    beforeEach(() => {
      component = setup().componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('caseId should be set', () => {
      expect(component.caseId).toEqual(1);
    });

    it('caseFile$ should be set', () => {
      let result;
      component.caseFile$.subscribe((r) => (result = r));
      expect(result).toEqual(mockCaseFile);
    });

    it('hearings$ should be set', () => {
      expect(component.hearings$).toEqual(mockSingleCaseTwoHearings);
    });

    describe('#onDeleteClicked', () => {
      it('should set the ID in the selectedAnnotationsforDeletion array', () => {
        component.onDeleteAnnotation(345);
        expect(component.selectedAnnotationsforDeletion).toEqual([345]);
      });
    });

    describe('#onDeleteConfirmed', () => {
      it('should use the IDs in the selectedAnnotationsforDeletion array and call the backend', () => {
        const annotationId = 123;
        component.onDeleteAnnotation(annotationId);
        component.onDeleteConfirmed();
        expect(fakeAnnotationService.deleteAnnotation).toHaveBeenCalledWith(annotationId);
        expect(component.tab).toEqual('All annotations');
      });
    });

    describe('#onDeleteCancelled', () => {
      it('should clear the ID in selectedAnnotationsforDeletion array', () => {
        const ids = [123, 321];
        component.selectedAnnotationsforDeletion = ids;
        expect(component.selectedAnnotationsforDeletion).toEqual(ids);
        component.onDeleteCancelled();
        expect(component.selectedAnnotationsforDeletion).toEqual([]);
        expect(component.tab).toEqual('All annotations');
      });
    });

    describe('#annotations', () => {
      it('annotations$ should be set if user is an admin or courthouse judge', () => {
        let result;
        component.annotations$.subscribe((r) => (result = r));
        expect([result]).toStrictEqual(mockAnnotation);
      });

      it('annotations$ should not be set if user has no admin or courthouse judge role', () => {
        jest.spyOn(caseServiceMock, 'getCase').mockReturnValue(of(mockCaseFileNoCourthouseId));
        jest.spyOn(fakeUserService, 'isAdmin').mockReturnValue(false);
        jest.spyOn(fakeUserService, 'isCourthouseJudge').mockReturnValue(false);

        let result;
        component.annotations$.subscribe((r) => (result = r));
        expect(result).toEqual(null);
      });
    });

    describe('onDownloadAnnotation', () => {
      it('should call the downloadAnnotationDocument method', fakeAsync(() => {
        component.onDownloadAnnotation({ annotationId: 1, annotationDocumentId: 1, fileName: 'file.pdf' });
        expect(fakeAnnotationService.downloadAnnotationDocument).toHaveBeenCalledWith(1, 1);
        tick();
        expect(fakeFileDownloadService.saveAs).toHaveBeenCalledWith({}, 'file.pdf');
      }));
    });
  });

  describe('Expired case', () => {
    let component: CaseComponent;

    it('should handle errors in caseService.getCaseHearings, caseService.getCaseTranscripts, caseService.getCaseAnnotations, and caseService.getCaseEvents', fakeAsync(() => {
      fixture = setup(true);
      component = fixture.componentInstance;

      fixture.detectChanges();

      let result;
      component.data$.subscribe((data) => (result = data));

      tick();

      expect(result).toEqual({
        caseFile: {
          ...mockCaseFile,
          isDataAnonymised: true,
          dataAnonymisedAt: DateTime.fromISO('2023-08-10T11:23:24.858Z'),
        },
        hearings: null,
        transcripts: null,
        annotations: null,
        events: null,
      });
    }));
  });
});
