import { Transcription, TranscriptionDocumentSearchResult, TranscriptionStatus } from '@admin-types/transcription';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CourthouseData } from '@core-types/index';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { TranscriptsComponent } from './transcripts.component';

describe('TranscriptsComponent', () => {
  let component: TranscriptsComponent;
  let fixture: ComponentFixture<TranscriptsComponent>;

  const MOCK_SEARCH_RESULT = [
    { id: 1, courthouse: { id: 1 }, status: { id: 1 } },
    { id: 2, courthouse: { id: 1 }, status: { id: 1 } },
  ] as Transcription[];

  const MOCK_COMPLETED_SEARCH_RESULT: TranscriptionDocumentSearchResult[] = [
    {
      transcriptionDocumentId: 0,
      transcriptionId: 0,
      case: {
        id: 0,
        caseNumber: 'caseNumber',
      },
      courthouse: {
        id: 0,
        displayName: 'courthouse',
      },
      hearing: {
        id: 0,
        hearingDate: DateTime.fromISO('2021-01-01'),
      },
      isManualTranscription: false,
      isHidden: false,
    },
    {
      transcriptionDocumentId: 1,
      transcriptionId: 1,
      case: {
        id: 1,
        caseNumber: 'caseNumber',
      },
      courthouse: {
        id: 1,
        displayName: 'courthouse',
      },
      hearing: {
        id: 1,
        hearingDate: DateTime.fromISO('2021-01-01'),
      },
      isManualTranscription: true,
      isHidden: false,
    },
  ];

  const MOCK_COURTHOUSES = of([
    {
      id: 1,
      display_name: 'Test display name',
      courthouse_name: 'Test courthouse name',
    } as CourthouseData,
  ]);

  const MOCK_STATUSES = of([{ id: 1, type: 'Approved', displayName: 'Approved' } as TranscriptionStatus]);

  const MOCK_MAPPING = [
    {
      courthouse: { courthouseName: 'Test courthouse name', displayName: 'Test display name', id: 1 },
      id: 1,
      status: { displayName: 'Approved', id: 1, type: 'Approved' },
    },
  ];

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        userId: 123,
      },
    },
  } as unknown as ActivatedRoute;

  const fakeCourthouseService = {
    getCourthouses: jest.fn().mockReturnValue(of([])),
  } as unknown as CourthouseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute,
        },
        {
          provide: TranscriptionAdminService,
          useValue: {
            getTranscriptionStatuses: jest.fn().mockReturnValue(MOCK_STATUSES),
            mapResults: jest.fn().mockReturnValue(MOCK_MAPPING),
            search: jest.fn().mockReturnValue(of(MOCK_SEARCH_RESULT)),
            searchCompletedTranscriptions: jest.fn().mockReturnValue(of(MOCK_COMPLETED_SEARCH_RESULT)),
          },
        },
        {
          provide: CourthouseService,
          useValue: {
            getCourthouses: jest.fn().mockReturnValue(MOCK_COURTHOUSES),
          },
        },
        { provide: CourthouseService, useValue: fakeCourthouseService },
        DatePipe,
        LuxonDatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start loading when search is triggered', () => {
    jest.spyOn(component, 'startLoading');
    component.search$.next({});
    expect(component.startLoading).toHaveBeenCalled();
  });

  it('should stop loading after search is completed', () => {
    jest.spyOn(component, 'stopLoading');
    jest.spyOn(component.transcriptService, 'search').mockReturnValue(of([]));
    component.search$.next({});
    expect(component.stopLoading).toHaveBeenCalled();
  });

  it('should call search when search is triggered', () => {
    jest.spyOn(component.transcriptService, 'search').mockReturnValue(of([]));
    component.search$.next({});
    component.isSubmitted$.next(true);
    expect(component.transcriptService.search).toHaveBeenCalled();
  });

  it('should call search with correct values', () => {
    const searchValues = { requestId: '123', caseId: '456', courthouse: 'Test Courthouse' };
    jest.spyOn(component.transcriptService, 'search').mockReturnValue(of([]));
    component.search$.next(searchValues);
    component.isSubmitted$.next(true);
    fixture.detectChanges();
    expect(component.transcriptService.search).toHaveBeenCalledWith(searchValues);
  });

  it('should map courthouses and statuses to search results', fakeAsync(() => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    let result;
    component.results$.subscribe((results) => (result = results));

    component.search$.next({});
    component.isSubmitted$.next(true);

    expect(result).toEqual([
      {
        id: 1,
        courthouse: {
          id: 1,
          displayName: 'Test display name',
          courthouseName: 'Test courthouse name',
        },
        status: { id: 1, type: 'Approved', displayName: 'Approved' },
      },
    ]);
  }));

  it('should clear the search when clearSearch is called', () => {
    jest.spyOn(component.search$, 'next');
    component.clearSearch();
    expect(component.search$.next).toHaveBeenCalledWith(null);
  });

  it('should set isSubmitted to true when onSubmit is called', () => {
    component.onSearch({});
    expect(component.isSubmitted$.value).toBe(true);
  });

  it('should set isSubmitted to false when clearSearch is called', () => {
    component.clearSearch();
    expect(component.isSubmitted$.value).toBe(false);
  });

  it('clears errors when clearSearch is called', () => {
    component.errors = [{ fieldId: '1', message: 'error' }];
    component.clearSearch();
    expect(component.errors).toEqual([]);
  });

  it('should navigate to the transcript page if only one result is returned', () => {
    jest.spyOn(component.router, 'navigate');
    jest.spyOn(component.transcriptService, 'search').mockReturnValue(of([MOCK_SEARCH_RESULT[0]]));
    component.search$.next({});
    component.isSubmitted$.next(true);
    expect(component.router.navigate).toHaveBeenCalledWith(['/admin/transcripts', 1]);
  });

  describe('completedResults$', () => {
    it('should return the results when the search is completed', () => {
      let result;

      component.completedResults$.subscribe((results) => (result = results));

      component.search$.next({});
      component.isSubmitted$.next(true);

      expect(result).toEqual(MOCK_COMPLETED_SEARCH_RESULT);
    });

    it('redirects to the document page if only one result is returned', () => {
      jest.spyOn(component.router, 'navigate');

      const transcriptService = TestBed.inject(TranscriptionAdminService);
      jest
        .spyOn(transcriptService, 'searchCompletedTranscriptions')
        .mockReturnValue(of([MOCK_COMPLETED_SEARCH_RESULT[0]]));

      component.completedResults$.subscribe();

      component.search$.next({});
      component.isSubmitted$.next(true);

      expect(component.router.navigate).toHaveBeenCalledWith(['/admin/transcripts/document', 0]);
    });
  });
});
