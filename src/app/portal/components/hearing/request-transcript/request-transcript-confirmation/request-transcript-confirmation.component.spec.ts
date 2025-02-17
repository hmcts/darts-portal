import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { DatePipe } from '@angular/common';
import { RequestTranscriptConfirmationComponent } from './request-transcript-confirmation.component';

describe('RequestTranscriptConfirmationComponent', () => {
  let component: RequestTranscriptConfirmationComponent;
  let fixture: ComponentFixture<RequestTranscriptConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTranscriptConfirmationComponent],
      providers: [DatePipe],
    }).overrideComponent(RequestTranscriptConfirmationComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });
    fixture = TestBed.createComponent(RequestTranscriptConfirmationComponent);
    component = fixture.componentInstance;
    component.urgencies = [{ transcription_urgency_id: 1, description: 'Urgent' }];
    component.case = { id: 1, number: '12345', courthouse: 'Reading', judges: ['Judy'] };
    component.hearing = {
      id: 1,
      date: DateTime.fromISO('2023-02-21T00:00:00Z'),
      judges: ['Joseph', 'Judy'],
      courtroom: '3',
      transcriptCount: 99,
    };
    component.urgencyId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render audio time if audioTimes is defined', () => {
    component.audioTimes = {
      startTime: DateTime.fromISO('2023-02-21T13:00:00Z'),
      endTime: DateTime.fromISO('2023-02-21T18:00:00Z'),
    };

    fixture.detectChanges();

    expect(component.audioTimesString).toEqual('Start time 13:00:00 - End time 18:00:00');
  });

  it('should not render audio time if audioTimes is undefined', () => {
    const element = fixture.nativeElement.querySelector('#audio-times');
    expect(element).toBeFalsy();
  });

  describe('#urgency', () => {
    it('should return the urgency description', () => {
      component.urgencyId = 1;
      component.urgencies = [{ transcription_urgency_id: 1, description: 'Urgent' }];
      expect(component.urgency).toEqual('Urgent');
    });
  });

  describe('#transcriptionType', () => {
    it('should return the transcription type description', () => {
      component.transcriptionTypeId = 1;
      component.transcriptionTypes = [{ transcription_type_id: 1, description: 'Transcription type' }];
      expect(component.transcriptionType).toEqual('Transcription type');
    });
  });

  describe('#onSubmit', () => {
    it('should emit errors if authorisationFormControl is false', () => {
      jest.spyOn(component.errors, 'emit');
      component.authorisationFormControl.patchValue(false);
      component.onSubmit();
      expect(component.errors.emit).toHaveBeenCalledWith([
        { fieldId: 'authorisation', message: 'You must confirm that you have authority to request a transcript' },
      ]);
    });

    it('should emit more detail text on confirm if authorisationFormControl is true', () => {
      jest.spyOn(component.confirm, 'emit');
      component.authorisationFormControl.patchValue(true);
      component.moreDetailFormControl.patchValue('test');
      component.onSubmit();
      expect(component.confirm.emit).toHaveBeenCalledWith('test');
    });

    it('should emit empty errors if authorisationFormControl is true', () => {
      jest.spyOn(component.errors, 'emit');
      component.authorisationFormControl.patchValue(true);
      component.onSubmit();
      expect(component.errors.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('#onCancel', () => {
    it('should emit cancel', () => {
      jest.spyOn(component.cancelled, 'emit');
      component.onCancel();
      expect(component.cancelled.emit).toHaveBeenCalled();
    });
  });
});
