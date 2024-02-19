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
      date: DateTime.fromISO('2023-01-01T00:00:00Z'),
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

      const startTimestamp = '2023-01-01T01:15:30.000Z';
      const endTimestamp = '2023-01-01T02:30:00.000Z';

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

      const startTimestamp = '2023-01-01T01:15:30.000Z';
      const endTimestamp = '2023-01-01T02:30:00.000Z';

      component.setFormValues({
        startTime: DateTime.fromISO(startTimestamp).toUTC(),
        endTime: DateTime.fromISO(endTimestamp).toUTC(),
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

    it('should set validationErrors if the form is invalid', () => {
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

    it('should emit the validationErrors', () => {
      jest.spyOn(component.errors, 'emit');
      component.onContinue();
      expect(component.errors.emit).toHaveBeenCalledWith(component.validationErrors);
    });
  });

  describe('#getStartEndTimeFromForm', () => {
    it('should return the start and end time from the form', () => {
      const expectedStartTimestamp = '2023-01-01T01:15:30.000Z';
      const expectedEndTimestamp = '2023-01-01T02:30:00.000Z';

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
      expect(startTime?.toISO()).toEqual(expectedStartTimestamp);
      expect(endTime?.toISO()).toEqual(expectedEndTimestamp);
    });
  });
});
