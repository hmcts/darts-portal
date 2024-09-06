import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { TranscriptsForDeletionComponent } from './transcripts-for-deletion.component';

describe('TranscriptsForDeletionComponent', () => {
  let component: TranscriptsForDeletionComponent;
  let fixture: ComponentFixture<TranscriptsForDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptsForDeletionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptsForDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTranscriptDeletion', () => {
    it('should delete the transcript', () => {
      const transcript = { id: 1, name: 'Transcript 1' } as unknown as TranscriptionDocumentForDeletion;
      const deleteTranscriptSpy = jest.spyOn(component.deletion, 'emit');

      component.deleteTranscript(transcript);

      expect(deleteTranscriptSpy).toHaveBeenCalledWith(transcript);
    });
  });
});
