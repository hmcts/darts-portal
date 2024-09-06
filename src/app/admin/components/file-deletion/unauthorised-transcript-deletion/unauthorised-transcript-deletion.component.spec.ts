import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorisedTranscriptDeletionComponent } from './unauthorised-transcript-deletion.component';

describe('UnauthorisedTranscriptDeletionComponent', () => {
  let component: UnauthorisedTranscriptDeletionComponent;
  let fixture: ComponentFixture<UnauthorisedTranscriptDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorisedTranscriptDeletionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorisedTranscriptDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
