import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTranscriptsFormComponent } from './search-transcripts-form.component';

describe('SearchTranscriptsFormComponent', () => {
  let component: SearchTranscriptsFormComponent;
  let fixture: ComponentFixture<SearchTranscriptsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTranscriptsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTranscriptsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
