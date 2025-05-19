import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserState } from '@core-types/user/user-state.interface';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';

import { EventEmitter, SimpleChange } from '@angular/core';
import { Validators } from '@angular/forms';
import { fieldErrors, RequestPlaybackAudioComponent } from './request-playback-audio.component';

describe('RequestPlaybackAudioComponent', () => {
  let component: RequestPlaybackAudioComponent;
  let fixture: ComponentFixture<RequestPlaybackAudioComponent>;

  beforeEach(() => {
    const userState: UserState = { userName: 'test@test.com', userId: 123, roles: [], isActive: true };
    const userServiceStub = {
      userProfile$: of(userState),
      isCourthouseTranscriber: jest.fn(),
      isAdmin: jest.fn(),
      isSuperUser: jest.fn(),
      isRCJAppeals: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RequestPlaybackAudioComponent],
      providers: [{ provide: UserService, useValue: userServiceStub }],
    });
    fixture = TestBed.createComponent(RequestPlaybackAudioComponent);
    component = fixture.componentInstance;
    component.audios = [
      {
        id: 0,
        media_start_timestamp: '2023-07-31T02:00:00.000',
        media_end_timestamp: '2023-07-31T15:45:00.000',
      },
    ];
    component.userState = { userId: 1, userName: 'Dean', roles: [], isActive: true };
    component.validationErrorEvent.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#setTimes', () => {
    it('should set the times for the input form', () => {
      const audioTimes = {
        startTime: DateTime.fromISO('2023-07-31T02:00:00.620'),
        endTime: DateTime.fromISO('2023-07-31T15:32:24.620'),
      };
      const expectedResult = {
        startTime: { hours: '02', minutes: '00', seconds: '00' },
        endTime: { hours: '15', minutes: '32', seconds: '24' },
        requestType: 'PLAYBACK',
      };

      component.audioTimes = audioTimes;
      fixture.detectChanges();
      component.setTimes();
      expect(component.audioRequestForm.value).toEqual(expectedResult);
    });
  });

  describe('#ngOnChanges', () =>
    it('should call setTimes if requestAudioTimes has been set', () => {
      const audioTimes = {
        startTime: DateTime.fromISO('2023-07-31T02:00:00.620'),
        endTime: DateTime.fromISO('2023-07-31T15:32:24.620'),
      };
      const setTimesSpy = jest.spyOn(component, 'setTimes');
      component.ngOnChanges({ audioTimes: new SimpleChange(null, audioTimes, false) });
      fixture.detectChanges();
      expect(setTimesSpy).toHaveBeenCalled();
    }));

  it('should reset the start and end times on the form if requestAudioTimes is empty', () => {
    const initialForm = {
      startTime: { hours: '02', minutes: '00', seconds: '00' },
      endTime: { hours: '15', minutes: '32', seconds: '24' },
      requestType: 'PLAYBACK',
    };
    const expectedResult = {
      startTime: { hours: null, minutes: null, seconds: null },
      endTime: { hours: null, minutes: null, seconds: null },
      requestType: 'PLAYBACK',
    };
    component.audioRequestForm.setValue(initialForm);
    component.ngOnChanges({ audioTimes: new SimpleChange(null, null, false) });
    fixture.detectChanges();
    expect(component.audioRequestForm.value).toEqual(expectedResult);
  });

  describe('#ngOnInit', () => {
    it('should set request type as required if the user is a transcriber', () => {
      jest.spyOn(component.userService, 'isAdmin').mockReturnValue(false);
      jest.spyOn(component.userService, 'isSuperUser').mockReturnValue(false);
      jest.spyOn(component.userService, 'isCourthouseTranscriber').mockReturnValue(true);
      component.ngOnInit();
      expect(component.audioRequestForm.get('requestType')?.hasValidator(Validators.required)).toBeTruthy();
    });

    it('should set request type as required if the user is a admin or super user', () => {
      jest.spyOn(component.userService, 'isCourthouseTranscriber').mockReturnValue(false);
      jest.spyOn(component.userService, 'isAdmin').mockReturnValue(true);
      component.ngOnInit();
      expect(component.audioRequestForm.get('requestType')?.hasValidator(Validators.required)).toBeTruthy();

      jest.spyOn(component.userService, 'isSuperUser').mockReturnValue(true);
      component.ngOnInit();
      expect(component.audioRequestForm.get('requestType')?.hasValidator(Validators.required)).toBeTruthy();
    });

    it('should not set any validators on request type if the user is not a transcriber, or admin, or super user', () => {
      jest.spyOn(component.userService, 'isCourthouseTranscriber').mockReturnValue(false);
      jest.spyOn(component.userService, 'isAdmin').mockReturnValue(false);
      jest.spyOn(component.userService, 'isSuperUser').mockReturnValue(false);
      component.ngOnInit();
      expect(component.audioRequestForm.get('requestType')?.hasValidator(Validators.required)).toBeFalsy();
    });

    it('should preserve endTimeAfterStart error when requestType changes', () => {
      const startTimeCtrl = component.audioRequestForm.get('startTime');
      const endTimeCtrl = component.audioRequestForm.get('endTime');

      startTimeCtrl?.setValue({ hours: '14', minutes: '30', seconds: '00' });
      endTimeCtrl?.setValue({ hours: '12', minutes: '30', seconds: '00' });

      endTimeCtrl?.setErrors({ endTimeAfterStart: true });

      const updateSpy = jest.spyOn(endTimeCtrl!, 'updateValueAndValidity');
      const setErrorsSpy = jest.spyOn(endTimeCtrl!, 'setErrors');

      component.audioRequestForm.get('requestType')?.setValue('DOWNLOAD');

      fixture.detectChanges();

      expect(updateSpy).toHaveBeenCalled();
      expect(setErrorsSpy).toHaveBeenCalledWith(expect.objectContaining({ endTimeAfterStart: true }));
    });

    it('should remove endTimeAfterStart error when endTime is corrected', () => {
      const endTimeCtrl = component.audioRequestForm.get('endTime');

      endTimeCtrl?.setErrors({ endTimeAfterStart: true });

      endTimeCtrl?.setValue({ hours: '12', minutes: '30', seconds: '00' });
      component.audioRequestForm.get('requestType')?.setValue('PLAYBACK');

      expect(endTimeCtrl?.errors).toBeNull();
    });
  });

  describe('#onSubmit', () => {
    describe('with valid request times', () => {
      let audioRequestSpy: jest.SpyInstance;

      beforeEach(() => {
        audioRequestSpy = jest.spyOn(component.audioRequest, 'emit');
        component.hearing = {
          id: 1,
          date: DateTime.fromISO('2023-09-01'),
          judges: ['HHJ M. Hussain KC'],
          courtroom: '3',
          transcriptCount: 1,
        };
      });

      it('exact match', () => {
        const audioRequestForm = {
          startTime: {
            hours: '02',
            minutes: '00',
            seconds: '00',
          },
          endTime: {
            hours: '15',
            minutes: '32',
            seconds: '24',
          },
          requestType: 'PLAYBACK',
        };
        const expectedResult = {
          hearing_id: 1,
          requestor: 1,
          start_time: '2023-09-01T02:00:00',
          end_time: '2023-09-01T15:32:24',
          request_type: 'PLAYBACK',
        };
        component.audioRequestForm.setValue(audioRequestForm);
        fixture.detectChanges();
        component.onSubmit();
        expect(component.requestObj).toEqual(expectedResult);
        expect(audioRequestSpy).toHaveBeenCalledWith(component.requestObj);
      });

      it('overlapping', () => {
        const audioRequestForm = {
          startTime: {
            hours: '01',
            minutes: '00',
            seconds: '00',
          },
          endTime: {
            hours: '17',
            minutes: '00',
            seconds: '00',
          },
          requestType: 'PLAYBACK',
        };
        const expectedResult = {
          hearing_id: 1,
          requestor: 1,
          start_time: '2023-09-01T01:00:00',
          end_time: '2023-09-01T17:00:00',
          request_type: 'PLAYBACK',
        };
        component.audioRequestForm.setValue(audioRequestForm);
        fixture.detectChanges();
        component.onSubmit();
        expect(component.requestObj).toEqual(expectedResult);
        expect(audioRequestSpy).toHaveBeenCalledWith(component.requestObj);
      });

      it('overlapping start', () => {
        const audioRequestForm = {
          startTime: {
            hours: '01',
            minutes: '00',
            seconds: '00',
          },
          endTime: {
            hours: '03',
            minutes: '00',
            seconds: '00',
          },
          requestType: 'PLAYBACK',
        };
        const expectedResult = {
          hearing_id: 1,
          requestor: 1,
          start_time: '2023-09-01T01:00:00',
          end_time: '2023-09-01T03:00:00',
          request_type: 'PLAYBACK',
        };
        component.audioRequestForm.setValue(audioRequestForm);
        fixture.detectChanges();
        component.onSubmit();
        expect(component.requestObj).toEqual(expectedResult);
        expect(audioRequestSpy).toHaveBeenCalledWith(component.requestObj);
      });

      it('overlapping end', () => {
        const audioRequestForm = {
          startTime: {
            hours: '15',
            minutes: '00',
            seconds: '00',
          },
          endTime: {
            hours: '17',
            minutes: '00',
            seconds: '00',
          },
          requestType: 'PLAYBACK',
        };
        const expectedResult = {
          hearing_id: 1,
          requestor: 1,
          start_time: '2023-09-01T15:00:00',
          end_time: '2023-09-01T17:00:00',
          request_type: 'PLAYBACK',
        };
        component.audioRequestForm.setValue(audioRequestForm);
        fixture.detectChanges();
        component.onSubmit();
        expect(component.requestObj).toEqual(expectedResult);
        expect(audioRequestSpy).toHaveBeenCalledWith(component.requestObj);
      });

      it('within', () => {
        const audioRequestForm = {
          startTime: {
            hours: '09',
            minutes: '00',
            seconds: '00',
          },
          endTime: {
            hours: '11',
            minutes: '00',
            seconds: '00',
          },
          requestType: 'PLAYBACK',
        };
        const expectedResult = {
          hearing_id: 1,
          requestor: 1,
          start_time: '2023-09-01T09:00:00',
          end_time: '2023-09-01T11:00:00',
          request_type: 'PLAYBACK',
        };
        component.audioRequestForm.setValue(audioRequestForm);
        fixture.detectChanges();
        component.onSubmit();
        expect(component.requestObj).toEqual(expectedResult);
        expect(audioRequestSpy).toHaveBeenCalledWith(component.requestObj);
      });
    });

    describe('with empty values', () => {
      it('returns null', () => {
        component.hearing = {
          id: 1,
          date: DateTime.fromISO('2023-09-01'),
          judges: ['HHJ M. Hussain KC'],
          courtroom: '3',
          transcriptCount: 1,
        };
        const audioRequestForm = {
          startTime: {
            hours: '',
            minutes: '',
            seconds: '',
          },
          endTime: {
            hours: '',
            minutes: '',
            seconds: '',
          },
          requestType: 'PLAYBACK',
        };
        component.audioRequestForm.setValue(audioRequestForm);
        component.onSubmit();
        expect(component.requestObj).toEqual(undefined);
      });
    });
  });

  describe('#onValidationError', () => {
    it('should emit validation errors when audio count is 0', () => {
      component.audios = [];
      fixture.detectChanges();
      const validationErrorSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      component.onValidationError();

      expect(component.audioRequestForm.controls.startTime.errors).toEqual({ unavailable: true });
      expect(component.audioRequestForm.controls.endTime.errors).toEqual({ unavailable: true });
      expect(validationErrorSpy).toHaveBeenCalledWith([
        { fieldId: 'start-time-hour-input', message: fieldErrors.startTime.unavailable },
        { fieldId: 'end-time-hour-input', message: fieldErrors.endTime.unavailable },
      ]);
    });

    it('should emit validation errors for invalid form fields and unavailable audio', () => {
      component.audios = [];
      fixture.detectChanges();
      component.audioRequestForm.controls.startTime.setErrors({ required: true });
      component.audioRequestForm.controls.endTime.setErrors({ required: true });
      const validationErrorSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      component.onValidationError();

      expect(component.audioRequestForm.controls.startTime.errors).toEqual({ unavailable: true });
      expect(component.audioRequestForm.controls.endTime.errors).toEqual({ unavailable: true });
      expect(validationErrorSpy).toHaveBeenCalledWith([
        { fieldId: 'start-time-hour-input', message: fieldErrors.startTime.unavailable },
        { fieldId: 'end-time-hour-input', message: fieldErrors.endTime.unavailable },
      ]);
    });

    it('should add invalidTime error message when startTime is invalid', () => {
      component.audios = [
        {
          id: 1,
          media_start_timestamp: '',
          media_end_timestamp: '',
        },
      ];

      fixture.detectChanges();

      // Set invalidTime error on startTime
      component.audioRequestForm.controls.startTime.setErrors({ invalidTime: true });
      const validationErrorSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      component.onValidationError();

      expect(component.errorSummary).toContainEqual({
        fieldId: 'start-time-hour-input',
        message: fieldErrors.startTime.invalidTime,
      });
      expect(validationErrorSpy).toHaveBeenCalledWith(
        expect.arrayContaining([{ fieldId: 'start-time-hour-input', message: fieldErrors.startTime.invalidTime }])
      );
    });

    it('should add invalidTime error message when endTime is invalid', () => {
      component.audios = [
        {
          id: 1,
          media_start_timestamp: '',
          media_end_timestamp: '',
        },
      ];
      fixture.detectChanges();

      // Set invalidTime error on endTime
      component.audioRequestForm.controls.endTime.setErrors({ invalidTime: true });
      const validationErrorSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      component.onValidationError();

      expect(component.errorSummary).toContainEqual({
        fieldId: 'end-time-hour-input',
        message: fieldErrors.endTime.invalidTime,
      });
      expect(validationErrorSpy).toHaveBeenCalledWith(
        expect.arrayContaining([{ fieldId: 'end-time-hour-input', message: fieldErrors.endTime.invalidTime }])
      );
    });

    it('should not add endTimeBeforeStartTime error if endTime is already invalid', () => {
      component.audios = [
        {
          id: 1,
          media_start_timestamp: '',
          media_end_timestamp: '',
        },
      ];
      fixture.detectChanges();

      // Set another error first
      component.audioRequestForm.controls.endTime.setErrors({ invalidTime: true });
      component.audioRequestForm.setErrors({ endTimeBeforeStartTime: true });

      component.onValidationError();

      expect(component.audioRequestForm.controls.endTime.errors).toEqual({ invalidTime: true });
      expect(component.errorSummary).not.toContainEqual({
        fieldId: 'end-time-hour-input',
        message: fieldErrors.endTime.endTimeAfterStart,
      });
    });
  });

  describe('#outsideAudioTimesValidation', () => {
    beforeEach(() => {
      component.hearing = {
        id: 1,
        date: DateTime.fromISO('2023-09-01'),
        judges: ['HHJ M. Hussain KC'],
        courtroom: '3',
        transcriptCount: 1,
      };

      fixture.detectChanges();
    });

    it('should set errors and emit validation errors when start time is outside the available audio times', () => {
      const errorSummaryEntry = [
        { fieldId: 'start-time-hour-input', message: fieldErrors.startTime.unavailable },
        { fieldId: 'end-time-hour-input', message: fieldErrors.endTime.unavailable },
      ];
      const validationErrorSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      const audioRequestForm = {
        startTime: {
          hours: '00',
          minutes: '59',
          seconds: '30',
        },
        endTime: {
          hours: '01',
          minutes: '20',
          seconds: '22',
        },
        requestType: 'PLAYBACK',
      };
      component.audioRequestForm.setValue(audioRequestForm);
      component.onSubmit();

      expect(component.audioRequestForm.controls.startTime.errors).toEqual({ unavailable: true });
      expect(component.audioRequestForm.errors).toEqual({ invalid: true });
      expect(validationErrorSpy).toHaveBeenCalledWith(errorSummaryEntry);
    });

    it('should set errors and emit validation errors when end time is outside the available audio times', () => {
      const errorSummaryEntry = [
        { fieldId: 'start-time-hour-input', message: fieldErrors.startTime.unavailable },
        { fieldId: 'end-time-hour-input', message: fieldErrors.endTime.unavailable },
      ];
      const validationErrorSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      const audioRequestForm = {
        startTime: {
          hours: '17',
          minutes: '10',
          seconds: '30',
        },
        endTime: {
          hours: '17',
          minutes: '55',
          seconds: '22',
        },
        requestType: 'PLAYBACK',
      };
      component.audioRequestForm.setValue(audioRequestForm);
      component.onSubmit();

      expect(component.audioRequestForm.controls.endTime.errors).toEqual({ unavailable: true });
      expect(component.audioRequestForm.errors).toEqual({ invalid: true });
      expect(validationErrorSpy).toHaveBeenCalledWith(errorSummaryEntry);
    });
  });

  describe('clearFormEvent', () => {
    it('should reset the form, clear errors, reset isSubmitted and emit empty validation errors', () => {
      const clearEmitter = new EventEmitter<void>();
      const validationSpy = jest.spyOn(component.validationErrorEvent, 'emit');

      component.clearFormEvent = clearEmitter;

      // Set up some form errors and state
      component.audioRequestForm.controls.startTime.setErrors({ required: true });
      component.audioRequestForm.controls.endTime.setErrors({ required: true });
      component.audioRequestForm.setErrors({ invalid: true });
      component.audioRequestForm.controls.requestType.setErrors({ required: true });
      component.isSubmitted = true;
      component.errorSummary = [{ fieldId: 'start-time-hour-input', message: 'required' }];

      fixture.detectChanges();
      component.ngOnInit();

      clearEmitter.emit();

      expect(component.isSubmitted).toBe(false);
      expect(component.errorSummary).toEqual([]);
      expect(validationSpy).toHaveBeenCalledWith([]);
    });
  });
});
