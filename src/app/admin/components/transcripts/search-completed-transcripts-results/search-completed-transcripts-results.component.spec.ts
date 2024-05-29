import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocument } from '@admin-types/index';
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
      const results: TranscriptionDocument[] = [
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
          caseNumber: 'caseNumber',
          courthouse: 'courthouse',
          hearingDate: DateTime.fromISO('2021-01-01'),
          requestMethod: true,
        },
      ];
      expect(component.mapRows(results)).toEqual(expected);
    });
  });
});
