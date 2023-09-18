import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';

import { RequestPlaybackAudioComponent } from './request-playback-audio.component';

describe('RequestPlaybackAudioComponent', () => {
  let component: RequestPlaybackAudioComponent;
  let fixture: ComponentFixture<RequestPlaybackAudioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestPlaybackAudioComponent],
    });
    fixture = TestBed.createComponent(RequestPlaybackAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#setTimes', () => {
    it('should set the times for the input form', () => {
      const requestAudioTimes = new Map<string, Date>([
        ['startDateTime', moment('2023-07-31T02:00:00.620').toDate()],
        ['endDateTime', moment('2023-07-31T15:32:24.620').toDate()],
      ]);
      const expectedResult = {
        startTime: { hours: '02', minutes: '00', seconds: '00' },
        endTime: { hours: '15', minutes: '32', seconds: '24' },
        requestType: '',
      };

      component.requestAudioTimes = requestAudioTimes;
      component.setTimes();
      expect(component.audioRequestForm.value).toEqual(expectedResult);
    });
  });

  describe('#ngOnChanges', () =>
    it('should call setTimes if requestAudioTimes has been set', () => {
      const requestAudioTimes = new Map<string, Date>([
        ['startDateTime', moment('2023-07-31T02:00:00.620').toDate()],
        ['endDateTime', moment('2023-07-31T15:32:24.620').toDate()],
      ]);
      const setTimesSpy = jest.spyOn(component, 'setTimes');
      component.ngOnChanges({ requestAudioTimes: new SimpleChange(null, requestAudioTimes, false) });
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
    component.ngOnChanges({ requestAudioTimes: new SimpleChange(null, undefined, false) });
    expect(component.audioRequestForm.value).toEqual(expectedResult);
  });

  describe('#onSubmit', () => {
    it('should create the request object when values are submitted', () => {
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
        requestType: 'DOWNLOAD',
      };
      const expectedResult = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      component.audioRequestForm.setValue(audioRequestForm);
      component.onSubmit();
      expect(component.requestObj).toEqual(expectedResult);
    });
  });
});
