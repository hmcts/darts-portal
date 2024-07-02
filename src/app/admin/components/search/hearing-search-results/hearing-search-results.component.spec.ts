import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingSearchResultsComponent } from './hearing-search-results.component';

describe('HearingSearchResultsComponent', () => {
  let component: HearingSearchResultsComponent;
  let fixture: ComponentFixture<HearingSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
