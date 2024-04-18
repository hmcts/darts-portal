import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTime } from 'luxon';
import { SearchTranscriptsResultsComponent } from './search-transcripts-results.component';

describe('SearchTranscriptsResultsComponent', () => {
  let component: SearchTranscriptsResultsComponent;
  let fixture: ComponentFixture<SearchTranscriptsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTranscriptsResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTranscriptsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mapRows should map results to row', () => {
    const results = [
      {
        id: 1,
        caseNumber: '123',
        courthouse: { displayName: 'Test courthouse name' },
        hearingDate: DateTime.fromISO('2021-01-01T00:00:00Z'),
        requestedAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
        status: { displayName: 'Test status' },
        isManual: true,
      },
    ];
    const expected = [
      {
        id: 1,
        caseNumber: '123',
        courthouse: 'Test courthouse name',
        hearingDate: DateTime.fromISO('2021-01-01T00:00:00Z'),
        requestedOn: DateTime.fromISO('2021-01-01T00:00:00Z'),
        status: 'Test status',
        requestMethod: true,
      },
    ];
    expect(component.mapRows(results)).toEqual(expected);
  });
});
