import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranscriptsForDeletionComponent } from './transcripts-for-deletion.component';

describe('TranscriptsForDeletionComponent', () => {
  let component: TranscriptsForDeletionComponent;
  let fixture: ComponentFixture<TranscriptsForDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptsForDeletionComponent],
      providers: [DatePipe, provideRouter([])],
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

  it('should show hyphens for missing optional fields', () => {
    const testRow: TranscriptionDocumentForDeletion = {
      transcriptionDocumentId: 1,
      transcriptionId: 100,
      // Missing caseNumber, hearingDate, courthouse, courtroom, markedHiddenBy
      reasonName: 'Test Reason',
      ticketReference: '',
      comments: '',
    };

    jest.spyOn(component, 'showDeleteButton').mockReturnValue(true);
    fixture.componentRef.setInput('rows', [testRow]);

    fixture.detectChanges();

    const tdElements = fixture.debugElement.queryAll(By.css('td'));

    // Check that at least 4 hyphens are displayed for the missing fields
    const hyphenCount = tdElements.filter((td) => td.nativeElement.textContent.trim() === '-').length;

    expect(hyphenCount).toBeGreaterThanOrEqual(4);
  });
});
