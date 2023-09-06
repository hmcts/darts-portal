import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingData } from 'src/app/types/hearing';

import { HearingResultsComponent } from './hearing-results.component';

describe('HearingResultsComponent', () => {
  let component: HearingResultsComponent;
  let fixture: ComponentFixture<HearingResultsComponent>;

  const mockSingleCaseTwoHearings: HearingData[] = [
    {
      id: 1,
      date: '2023-09-01',
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcript_count: 1,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HearingResultsComponent],
    });
    fixture = TestBed.createComponent(HearingResultsComponent);
    component = fixture.componentInstance;
    component.hearings = mockSingleCaseTwoHearings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
