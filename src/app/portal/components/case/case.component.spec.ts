import { DatePipe } from '@angular/common';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TabDirective } from '@directives/tab.directive';
import { AnnotationsData, Case, CaseEvent, Hearing, TranscriptData } from '@portal-types/index';
import { AnnotationService } from '@services/annotation/annotation.service';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CaseService } from '@services/case/case.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { Observable, of, throwError } from 'rxjs';
import { CaseComponent } from './case.component';

describe('CaseComponent', () => {
  let fixture: ComponentFixture<CaseComponent>;

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
      eventName: 'Hearing',
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
      courtroom: 'Courtroom 1',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Requested',
      courtroom: 'Courtroom 1',
    },
    {
      transcription_id: 1,
      hearing_id: 2,
      hearing_date: '2023-10-12',
      type: 'Sentencing remarks',
      requested_on: '2023-10-12T00:00:00Z',
      requested_by_name: 'Joe Bloggs',
      status: 'Complete',
      courtroom: 'Courtroom 1',
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
    getCaseEventsPaginated: jest.fn().mockReturnValue(
      of({
        data: mockEvents,
        totalItems: 120,
        currentPage: 1,
      })
    ),
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

  const fakeUserService = {
    isSuperUser: jest.fn(() => true),
    isTranscriber: jest.fn(() => false),
    isJudge: jest.fn(() => true),
    isApprover: jest.fn(() => false),
    isRequester: jest.fn(() => false),
    isAdmin: jest.fn(() => true),
    isTranslationQA: jest.fn(() => false),
    isCourthouseJudge: jest.fn(() => false),
  };

  const fakeFileDownloadService = {
    saveAs: jest.fn(),
  };

  const fakeAppConfigService = {
    getAppConfig: jest.fn().mockReturnValue({ pagination: { courtLogEventsPageLimit: 500 } }),
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
        { provide: AppConfigService, useValue: fakeAppConfigService },
        { provide: DatePipe },
      ],
    }).createComponent(CaseComponent);
  };

  describe('CaseComponent - Base functionality and annotations', () => {
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

  describe('CaseComponent - Data stream loading and error handling', () => {
    let component: CaseComponent;

    it('should initialize data$ with the correct values', () => {
      fixture = setup();
      component = fixture.componentInstance;

      component.data$.subscribe((data) => {
        expect(data).toEqual({
          caseFile: mockCaseFile,
          hearings: mockSingleCaseTwoHearings,
          transcripts: mockTranscript,
          annotations: mockAnnotation,
          events: mockEvents,
        });
      });
    });

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
      });
    }));
  });

  describe('CaseComponent - Tab Logic', () => {
    let component: CaseComponent;

    beforeEach(() => {
      fixture = setup();
      component = fixture.componentInstance;
    });

    describe('#ngOnInit', () => {
      it('should call loadEvents if Court log tab is the default', () => {
        const loadEventsSpy = jest.spyOn(component, 'loadEvents');

        component['tab'] = 'Court log';
        component['eventsLoaded'].set(false); // Ensure not already loaded
        component.ngOnInit();

        expect(loadEventsSpy).toHaveBeenCalled();
      });

      it('should not call loadEvents if default tab is not Court log', () => {
        const loadEventsSpy = jest.spyOn(component, 'loadEvents');

        component['tab'] = 'Hearings';
        component.ngOnInit();

        expect(loadEventsSpy).not.toHaveBeenCalled();
      });
    });

    describe('#onTabChange', () => {
      it('should update active tab in ActiveTabService', () => {
        const setActiveTabSpy = jest.spyOn(component['tabsService'], 'setActiveTab');
        const event: TabDirective = { name: 'Transcripts' } as TabDirective;

        component.onTabChange(event);

        expect(setActiveTabSpy).toHaveBeenCalledWith('case', 'Transcripts');
      });

      it('should call loadEvents only if tab is Court log and events not yet loaded', () => {
        const loadEventsSpy = jest.spyOn(component, 'loadEvents');

        component['eventsLoaded'].set(false);
        const event: TabDirective = { name: 'Court log' } as TabDirective;

        component.onTabChange(event);

        expect(loadEventsSpy).toHaveBeenCalled();
      });

      it('should NOT call loadEvents if tab is not Court log', () => {
        const loadEventsSpy = jest.spyOn(component, 'loadEvents');

        const event: TabDirective = { name: 'Annotations' } as TabDirective;
        component.onTabChange(event);

        expect(loadEventsSpy).not.toHaveBeenCalled();
      });

      it('should NOT call loadEvents if events already loaded', () => {
        const loadEventsSpy = jest.spyOn(component, 'loadEvents');

        component['eventsLoaded'].set(true);
        const event: TabDirective = { name: 'Court log' } as TabDirective;

        component.onTabChange(event);

        expect(loadEventsSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('CaseComponent - Court log pagination and sorting', () => {
    let component: CaseComponent;

    beforeEach(() => {
      fixture = setup();
      component = fixture.componentInstance;

      // Set up test values
      component.events.set(mockEvents);
      component.eventsTotalItems.set(10);
      component.eventsSort.set({ sortBy: 'timestamp', sortOrder: 'asc' });
      component.eventsCurrentPage.set(1);
      fixture.detectChanges();
    });

    it('should call getCaseEventsPaginated with correct params in loadEvents', () => {
      const mockResponse = {
        data: mockEvents,
        totalItems: 120,
        currentPage: 1,
      };

      const getCaseEventsPaginatedSpy = jest
        .spyOn(caseServiceMock, 'getCaseEventsPaginated')
        .mockReturnValue(of(mockResponse));

      component.eventsSort.set({ sortBy: 'timestamp', sortOrder: 'asc' });
      component.eventsCurrentPage.set(1);

      component.loadEvents();

      expect(getCaseEventsPaginatedSpy).toHaveBeenCalledWith(1, {
        page_number: 1,
        page_size: component.eventsPageLimit,
        sort_by: 'timestamp',
        sort_order: 'asc',
      });

      expect(component.events()).toEqual(mockResponse.data);
      expect(component.eventsTotalItems()).toBe(120);
      expect(component.eventsCurrentPage()).toBe(1);
    });

    it('should update current page and call loadEvents on onPageChange', () => {
      const loadEventsSpy = jest.spyOn(component, 'loadEvents');

      jest.spyOn(caseServiceMock, 'getCaseEventsPaginated').mockReturnValue(
        of({
          data: mockEvents,
          totalItems: 120,
          currentPage: 2,
        })
      );

      component.onPageChange(2);

      expect(component.eventsCurrentPage()).toBe(2);
      expect(loadEventsSpy).toHaveBeenCalled();
    });

    it('should update sort and call loadEvents on onSortChange', () => {
      const loadEventsSpy = jest.spyOn(component, 'loadEvents');
      const sortParams = { sortBy: 'hearingDate', sortOrder: 'desc' } as const;

      component.onSortChange(sortParams);

      expect(component.eventsSort()).toEqual(sortParams);
      expect(loadEventsSpy).toHaveBeenCalled();
    });
  });
});
