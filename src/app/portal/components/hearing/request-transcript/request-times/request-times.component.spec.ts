import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingEvent } from '@portal-types/index';
import { DateTime } from 'luxon';

import { RequestTimesComponent } from './request-times.component';

describe('RequestTimesComponent', () => {
  let component: RequestTimesComponent;
  let fixture: ComponentFixture<RequestTimesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTimesComponent],
    });
    fixture = TestBed.createComponent(RequestTimesComponent);
    component = fixture.componentInstance;
    component.hearing = {
      id: 1,
      date: DateTime.fromISO('2023-01-01T00:00:00'),
      judges: ['Joseph', 'Judy'],
      courtroom: '3',
      transcriptCount: 99,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onEventRowSelected', () => {
    it('should set the start and end time from the selected row', () => {
      const expectedFormValues = {
        startTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
        endTime: {
          hours: '02',
          minutes: '30',
          seconds: '00',
        },
      };

      const startTimestamp = '2023-01-01T01:15:30.000';
      const endTimestamp = '2023-01-01T02:30:00.000';

      const audioRow: HearingEvent[] = [
        {
          id: 1,
          timestamp: startTimestamp,
          name: 'event 1',
          text: 'event 1 text',
        },
        {
          id: 2,
          timestamp: endTimestamp,
          name: 'event 2',
          text: 'event 2 text',
        },
      ];

      component.onEventRowSelected(audioRow);
      expect(component.form.value).toEqual(expectedFormValues);
    });
  });

  describe('#setFormValues', () => {
    it('should set the form values', () => {
      const expectedFormValues = {
        startTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
        endTime: {
          hours: '02',
          minutes: '30',
          seconds: '00',
        },
      };

      const startTimestamp = '2023-01-01T01:15:30.000';
      const endTimestamp = '2023-01-01T02:30:00.000';

      component.setFormValues({
        startTime: DateTime.fromISO(startTimestamp),
        endTime: DateTime.fromISO(endTimestamp),
      });
      expect(component.form.value).toEqual(expectedFormValues);
    });

    it('should set the form values to null if the values are null', () => {
      const expectedFormValues = {
        startTime: {
          hours: null,
          minutes: null,
          seconds: null,
        },
        endTime: {
          hours: null,
          minutes: null,
          seconds: null,
        },
      };

      component.setFormValues({ startTime: null, endTime: null });
      expect(component.form.value).toEqual(expectedFormValues);
    });
  });

  describe('#onCancel', () => {
    it('should emit the cancel event', () => {
      jest.spyOn(component.cancel, 'emit');
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('#onContinue', () => {
    it('should set isSubmitted to true', () => {
      component.onContinue();
      expect(component.isSubmitted).toBeTruthy();
    });

    it('should set validationErrors to an empty array if the form is valid', () => {
      component.form.patchValue({
        startTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
        endTime: {
          hours: '02',
          minutes: '30',
          seconds: '00',
        },
      });
      component.onContinue();
      expect(component.validationErrors).toEqual([]);
    });

    it('should set validationErrors if the times are left blank', () => {
      const expectedValidationErrors = [
        {
          fieldId: 'start-hour-input',
          message: 'Select a start time',
        },
        {
          fieldId: 'end-hour-input',
          message: 'Select an end time',
        },
      ];
      component.onContinue();
      expect(component.validationErrors).toEqual(expectedValidationErrors);
    });

    it('should set validationErrors if the end time before start time', () => {
      const expectedValidationErrors = [
        {
          fieldId: 'end-hour-input',
          message: 'End time must be after start time',
        },
      ];
      component.form.patchValue({
        startTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
        endTime: {
          hours: '01',
          minutes: '10',
          seconds: '00',
        },
      });
      component.onContinue();
      expect(component.validationErrors).toEqual(expectedValidationErrors);
    });

    it('should set validationErrors if the end time equals start time', () => {
      const expectedValidationErrors = [
        {
          fieldId: 'end-hour-input',
          message: 'End time must be after start time',
        },
      ];
      component.form.patchValue({
        startTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
        endTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
      });
      component.onContinue();
      expect(component.validationErrors).toEqual(expectedValidationErrors);
    });

    it('should emit the validationErrors', () => {
      jest.spyOn(component.errors, 'emit');
      component.onContinue();
      expect(component.errors.emit).toHaveBeenCalledWith(component.validationErrors);
    });
  });

  describe('#getStartEndTimeFromForm', () => {
    it('should return the start and end time from the form', () => {
      const expectedStartTimestamp = '2023-01-01T01:15:30.000';
      const expectedEndTimestamp = '2023-01-01T02:30:00.000';

      component.form.patchValue({
        startTime: {
          hours: '01',
          minutes: '15',
          seconds: '30',
        },
        endTime: {
          hours: '02',
          minutes: '30',
          seconds: '00',
        },
      });

      const { startTime, endTime } = component.getStartEndTimeFromForm();
      expect(startTime?.toISO({ includeOffset: false })).toEqual(expectedStartTimestamp);
      expect(endTime?.toISO({ includeOffset: false })).toEqual(expectedEndTimestamp);
    });
  });

  describe('#fieldHasError', () => {
    it('returns true if an error exists', () => {
      component.validationErrors = [
        {
          fieldId: 'some-field',
          message: 'Some error',
        },
      ];
      expect(component.fieldHasError('some-field')).toBeTruthy();
    });

    it('returns false when no error exists', () => {
      component.validationErrors = [
        {
          fieldId: 'some-field',
          message: 'Some error',
        },
      ];
      expect(component.fieldHasError('some-other-field')).toBeFalsy();
    });
  });

  describe('#getValidationMessage', () => {
    it('returns message', () => {
      component.validationErrors = [
        {
          fieldId: 'some-field',
          message: 'Some error',
        },
      ];
      expect(component.getValidationMessage('some-field')).toBe('Some error');
    });

    it('returns empty string if no message exists', () => {
      component.validationErrors = [
        {
          fieldId: 'some-field',
          message: 'Some error',
        },
      ];
      expect(component.getValidationMessage('some-other-field')).toBe('');
    });
  });
});
