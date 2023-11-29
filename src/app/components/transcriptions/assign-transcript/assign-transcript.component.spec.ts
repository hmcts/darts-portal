import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTranscriptComponent } from './assign-transcript.component';

describe('AssignTranscriptComponent', () => {
  let component: AssignTranscriptComponent;
  let fixture: ComponentFixture<AssignTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTranscriptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
