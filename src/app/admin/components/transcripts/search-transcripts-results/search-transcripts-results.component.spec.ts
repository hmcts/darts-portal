import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTranscriptsResultsComponent } from './search-transcripts-results.component';

describe('SearchTranscriptsResultsComponent', () => {
  let component: SearchTranscriptsResultsComponent;
  let fixture: ComponentFixture<SearchTranscriptsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTranscriptsResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchTranscriptsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
