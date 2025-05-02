import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { TranscriptsRow } from '@portal-types/transcriptions';
import { DateTime } from 'luxon';
import { CaseTranscriptsTableComponent } from './case-transcripts-table.component';

describe('CaseTranscriptsTableComponent', () => {
  let component: CaseTranscriptsTableComponent;
  let fixture: ComponentFixture<CaseTranscriptsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTranscriptsTableComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseTranscriptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default columns when adminScreen is false', () => {
    fixture.componentRef.setInput('adminScreen', false);
    fixture.detectChanges();

    expect(component.columns.length).toBe(6);
    expect(component.columns.map((col) => col.name)).toContain('Hearing date');
  });

  it('should use adminColumns when adminScreen is true', () => {
    fixture.componentRef.setInput('adminScreen', true);
    fixture.detectChanges();

    expect(component.adminColumns.length).toBe(6);
    expect(component.adminColumns.map((col) => col.name)).toContain('Transcript ID');
  });

  it('should bind the transcripts input correctly', () => {
    const testData: TranscriptsRow[] = [
      {
        id: 1,
        type: 'Trial',
        hearingId: 1,
        requestedBy: 'John',
        requestedOn: DateTime.fromISO('2023-01-01'),
        status: 'Complete',
        hearingDate: DateTime.fromISO('2023-01-01'),
        courtroom: '1',
      },
    ];

    fixture.componentRef.setInput('transcripts', testData);
    fixture.detectChanges();

    expect(component.transcripts()).toEqual(testData);
  });

  it('should bind the caseId input correctly', () => {
    fixture.componentRef.setInput('caseId', 123);
    fixture.detectChanges();

    expect(component.caseId()).toBe(123);
  });

  it('should bind the adminScreen input correctly', () => {
    fixture.componentRef.setInput('adminScreen', true);
    fixture.detectChanges();

    expect(component.adminScreen()).toBe(true);
  });

  it('should have statusColours matching the constant', () => {
    expect(component.statusColours).toBe(transcriptStatusTagColours);
  });
});
