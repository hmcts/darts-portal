import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedTranscriptComponent } from './approved-transcript.component';

describe('ApprovedTranscriptComponent', () => {
  let component: ApprovedTranscriptComponent;
  let fixture: ComponentFixture<ApprovedTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedTranscriptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovedTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
