import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseSearchResultsComponent } from './case-search-results.component';

describe('ResultsComponent', () => {
  let component: CaseSearchResultsComponent;
  let fixture: ComponentFixture<CaseSearchResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseSearchResultsComponent],
      providers: [DatePipe],
    });
    fixture = TestBed.createComponent(CaseSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
