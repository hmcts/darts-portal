import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { HearingSearchResultsComponent } from './hearing-search-results.component';

describe('HearingSearchResultsComponent', () => {
  let component: HearingSearchResultsComponent;
  let fixture: ComponentFixture<HearingSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingSearchResultsComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute caption correctly for single hearing', () => {
    const hearings = [
      {
        caseNumber: '123',
        hearingDate: DateTime.fromISO('2023-10-01'),
        courthouse: 'Courthouse A',
        courtroom: 'Room 1',
      },
    ];
    fixture.componentRef.setInput('hearings', hearings);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing result');
  });

  it('should compute caption correctly for multiple hearings', () => {
    const hearings = [
      {
        caseNumber: '123',
        hearingDate: DateTime.fromISO('2023-10-01'),
        courthouse: 'Courthouse A',
        courtroom: 'Room 1',
      },
      {
        caseNumber: '456',
        hearingDate: DateTime.fromISO('2023-10-02'),
        courthouse: 'Courthouse B',
        courtroom: 'Room 2',
      },
    ];
    fixture.componentRef.setInput('hearings', hearings);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing results');
  });
});
