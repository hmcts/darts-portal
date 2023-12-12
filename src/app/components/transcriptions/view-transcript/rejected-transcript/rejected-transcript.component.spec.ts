import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedTranscriptComponent } from './rejected-transcript.component';

describe('RejectedTranscriptComponent', () => {
  let component: RejectedTranscriptComponent;
  let fixture: ComponentFixture<RejectedTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedTranscriptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectedTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
