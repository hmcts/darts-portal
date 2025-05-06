import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocumentSearchResult } from '@admin-types/index';
import { DateTime } from 'luxon';
import { SearchCompletedTranscriptsResultsComponent } from './search-completed-transcripts-results.component';

describe('SearchCompletedTranscriptsResultsComponent', () => {
  let component: SearchCompletedTranscriptsResultsComponent;
  let fixture: ComponentFixture<SearchCompletedTranscriptsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCompletedTranscriptsResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCompletedTranscriptsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should call mapRows', () => {
      jest.spyOn(component, 'mapRows');
      component.ngOnChanges();
      expect(component.mapRows).toHaveBeenCalled();
    });
  });

  describe('mapRows', () => {
    it('should return an array of objects with the correct properties', () => {
      const results: TranscriptionDocumentSearchResult[] = [
        {
          transcriptionDocumentId: 1,
          case: { id: 1, caseNumber: 'caseNumber' },
          courthouse: { id: 1, displayName: 'courthouse' },
          hearing: { id: 1, hearingDate: DateTime.fromISO('2021-01-01') },
          isManualTranscription: true,
          transcriptionId: 0,
          isHidden: false,
        },
      ];
      const expected = [
        {
          id: 1,
          caseId: 1,
          requestId: 0,
          caseNumber: 'caseNumber',
          courthouse: 'courthouse',
          hearingDate: DateTime.fromISO('2021-01-01'),
          hearingId: 1,
          requestMethod: true,
          isHidden: false,
        },
      ];
      expect(component.mapRows(results)).toEqual(expected);
    });

    it('should handle undefined hearing ID', () => {
      const results: TranscriptionDocumentSearchResult[] = [
        {
          transcriptionDocumentId: 1,
          case: { id: 1, caseNumber: 'caseNumber' },
          courthouse: { id: 1, displayName: 'courthouse' },
          hearing: { hearingDate: DateTime.fromISO('2021-01-01') },
          isManualTranscription: true,
          transcriptionId: 0,
          isHidden: false,
        },
      ];
      expect(component.mapRows(results)[0].hearingId).toBeUndefined();
    });
  });
});
