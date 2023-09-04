import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingResultsComponent } from './hearing-results.component';

describe('HearingResultsComponent', () => {
  let component: HearingResultsComponent;
  let fixture: ComponentFixture<HearingResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HearingResultsComponent],
    });
    fixture = TestBed.createComponent(HearingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
