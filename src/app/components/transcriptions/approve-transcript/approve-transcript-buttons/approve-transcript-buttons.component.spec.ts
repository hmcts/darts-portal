import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTranscriptButtonsComponent } from './approve-transcript-buttons.component';

describe('ApproveTranscriptButtonsComponent', () => {
  let component: ApproveTranscriptButtonsComponent;
  let fixture: ComponentFixture<ApproveTranscriptButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveTranscriptButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveTranscriptButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
