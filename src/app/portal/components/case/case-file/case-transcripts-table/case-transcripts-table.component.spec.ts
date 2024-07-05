import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTranscriptsTableComponent } from './case-transcripts-table.component';

describe('CaseTranscriptsTableComponent', () => {
  let component: CaseTranscriptsTableComponent;
  let fixture: ComponentFixture<CaseTranscriptsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTranscriptsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseTranscriptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
