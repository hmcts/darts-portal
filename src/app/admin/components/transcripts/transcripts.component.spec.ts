import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Transcription, TranscriptionStatus } from '@admin-types/transcription';
import { CourthouseData } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { of } from 'rxjs';
import { TranscriptsComponent } from './transcripts.component';

describe('TranscriptsComponent', () => {
  let component: TranscriptsComponent;
  let fixture: ComponentFixture<TranscriptsComponent>;

  beforeEach(async () => {
    const MOCK_COURTHOUSES = of([
      {
        id: 1,
        display_name: 'Test display name',
        courthouse_name: 'Test courthouse name',
      } as CourthouseData,
    ]);

    const MOCK_SEARCH_RESULT = of([{ id: 1, courthouse: { id: 1 }, status: { id: 1 } } as Transcription]);

    const MOCK_STATUSES = of([{ id: 1, type: 'Test type', displayName: 'Test display name' } as TranscriptionStatus]);

    await TestBed.configureTestingModule({
      imports: [TranscriptsComponent],
      providers: [
        {
          provide: TranscriptionAdminService,
          useValue: {
            getTranscriptionStatuses: jest.fn().mockReturnValue(MOCK_STATUSES),
            search: jest.fn().mockReturnValue(MOCK_SEARCH_RESULT),
          },
        },
        {
          provide: CourthouseService,
          useValue: {
            getCourthouses: jest.fn().mockReturnValue(MOCK_COURTHOUSES),
          },
        },
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
    let result;
    component.results$.subscribe((results) => (result = results));

    component.search$.next({});
    component.isSubmitted$.next(true);

    tick();

    expect(result).toEqual([
      {
        id: 1,
        courthouse: {
          id: 1,
          displayName: 'Test display name',
          courthouseName: 'Test courthouse name',
        },
        status: { id: 1, type: 'Test type', displayName: 'Test display name' },
      },
    ]);
  }));

  it('should clear the search when onClear is called', () => {
    jest.spyOn(component.search$, 'next');
    component.onClear();
    expect(component.search$.next).toHaveBeenCalledWith(null);
  });

  it('should set isSubmitted to true when onSubmit is called', () => {
    component.onSearch({});
    expect(component.isSubmitted$.value).toBe(true);
  });

  it('should set isSubmitted to false when onClear is called', () => {
    component.onClear();
    expect(component.isSubmitted$.value).toBe(false);
  });
});
