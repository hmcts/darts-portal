import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseHearingTranscriptComponent } from './case-hearing-transcript.component';

describe('CaseHearingTranscriptComponent', () => {
  let component: CaseHearingTranscriptComponent;
  let fixture: ComponentFixture<CaseHearingTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseHearingTranscriptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseHearingTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
