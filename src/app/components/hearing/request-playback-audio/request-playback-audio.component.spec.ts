import { HttpClient } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';

import { RequestPlaybackAudioComponent } from './request-playback-audio.component';

describe('RequestPlaybackAudioComponent', () => {
  let component: RequestPlaybackAudioComponent;
  let fixture: ComponentFixture<RequestPlaybackAudioComponent>;
  let userService: UserService;
  let httpClientSpy: HttpClient;

  beforeEach(() => {
    httpClientSpy = { get: jest.fn() } as unknown as HttpClient;

    userService = new UserService(httpClientSpy);

    TestBed.configureTestingModule({
      imports: [RequestPlaybackAudioComponent],
      providers: [{ provide: UserService, useValue: userService }],
    });
    fixture = TestBed.createComponent(RequestPlaybackAudioComponent);
    component = fixture.componentInstance;
    component.userState = { userId: 1, userName: 'Dean', roles: [] };
    fixture.detectChanges();
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
      component.setTimes();
      expect(component.audioRequestForm.value).toEqual(expectedResult);
    });
  });

  describe('#ngOnChanges', () =>
    it('should call setTimes if requestAudioTimes has been set', () => {
      const audioTimes = {
        startTime: DateTime.fromISO('2023-07-31T02:00:00.620').toUTC(),
        endTime: DateTime.fromISO('2023-07-31T15:32:24.620').toUTC(),
      };
      const setTimesSpy = jest.spyOn(component, 'setTimes');
      component.ngOnChanges({ audioTimes: new SimpleChange(null, audioTimes, false) });
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
    expect(component.audioRequestForm.value).toEqual(expectedResult);
  });

  describe('#ngOnInit', () => {
    it('should set request type as required if the user is a transcriber', () => {
      const permissions = [{ permissionId: 1, permissionName: 'local dev permissions' }];
      component.userState = {
        userId: 1,
        userName: 'Dean',
        roles: [
          {
            roleId: 123,
            roleName: 'TRANSCRIBER',
            permissions: permissions,
          },
        ],
      };
      component.ngOnInit();
      expect(component.audioRequestForm.get('requestType')?.hasValidator(Validators.required)).toBeTruthy();
    });
    it('should not set any validators on request type if the user is not a transcriber', () => {
      component.userState = {
        userId: 1,
        userName: 'Dean',
        roles: [],
      };
      component.ngOnInit();
      expect(component.audioRequestForm.get('requestType')?.hasValidator(Validators.required)).toBeFalsy();
    });
  });

  describe('#onSubmit', () => {
    it('should create the request object when values are submitted', () => {
      const audioRequestSpy = jest.spyOn(component.audioRequest, 'emit');
      component.hearing = {
        id: 1,
        date: '2023-09-01',
        judges: ['HHJ M. Hussain KC'],
        courtroom: '3',
        transcript_count: 1,
      };
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
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'PLAYBACK',
      };
      component.audioRequestForm.setValue(audioRequestForm);
      component.onSubmit();
      expect(component.requestObj).toEqual(expectedResult);
      expect(audioRequestSpy).toHaveBeenCalledWith(component.requestObj);
    });
    it('should return null when nothing is submitted', () => {
      component.hearing = {
        id: 1,
        date: '2023-09-01',
        judges: ['HHJ M. Hussain KC'],
        courtroom: '3',
        transcript_count: 1,
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
