import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthouseSearchResultsComponent } from './courthouse-search-results.component';

describe('CourthouseSearchResultsComponent', () => {
  let component: CourthouseSearchResultsComponent;
  let fixture: ComponentFixture<CourthouseSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthouseSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
