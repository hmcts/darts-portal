import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingComponent } from './hearing.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { CaseData } from '@darts-types/case';
import { HearingData } from '@darts-types/hearing';
import { CaseService } from '@services/case/case.service';
import { HearingAudioEventViewModel } from '@darts-types/hearing-audio-event';
import { requestPlaybackAudioDTO } from '@darts-types/requestPlaybackAudioDTO';
import { HearingService } from '@services/hearing/hearing.service';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { HearingEventTypeEnum } from '@darts-types/index';

describe('HearingComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let caseService: CaseService;
  let hearingService: HearingService;
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;

  const cd = of({ case_id: 1, case_number: '12345', courthouse: 'Reading', judges: ['Judy'] }) as Observable<CaseData>;
  const hd = of([
    { id: 1, date: '2023-02-21', judges: ['Joseph', 'Judy'], courtroom: '3', transcript_count: 99 },
    { id: 2, date: '2023-03-21', judges: ['Joseph', 'Kennedy'], courtroom: '1', transcript_count: 12 },
  ]) as Observable<HearingData[]>;
  const ad = of([
    {
      id: 1,
      media_start_timestamp: '2023-09-14T12:05:08.563Z',
      media_end_timestamp: '2023-09-14T12:05:08.563Z',
    },
  ]);
  const ed = of([
    {
      id: 1,
      timestamp: '2023-07-31T14:32:24.62Z',
      name: 'Case called on',
      text: 'Record:New Case',
    },
  ]);

  const shd = of({
    id: 1,
    date: '2023-02-21',
    judges: ['Joseph', 'Judy'],
    courtroom: '3',
    transcript_count: 99,
  }) as Observable<HearingData>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    caseService = new CaseService(httpClientSpy);
    hearingService = new HearingService(httpClientSpy);

    jest.spyOn(caseService, 'getCase').mockReturnValue(cd);
    jest.spyOn(caseService, 'getCaseHearings').mockReturnValue(hd);
    jest.spyOn(caseService, 'getHearingById').mockReturnValue(shd);
    jest.spyOn(hearingService, 'getAudio').mockReturnValue(ad);
    jest.spyOn(hearingService, 'getEvents').mockReturnValue(ed);

    TestBed.configureTestingModule({
      imports: [HearingComponent, HearingFileComponent, RouterTestingModule],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: CaseService, useValue: caseService },
        { provide: HearingService, useValue: hearingService },
      ],
    });
    fixture = TestBed.createComponent(HearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.caseId = 1;
    component.hearingId = 1;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test child inputs for hearing file', () => {
    let fixture;
    let parentComponent: HearingComponent;
    let childComponent: HearingFileComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(HearingComponent);
      parentComponent = fixture.componentInstance;

      parentComponent.case$ = cd;
      parentComponent.hearing$ = caseService.getHearingById(1, 1);
      fixture.detectChanges();
      childComponent = fixture.debugElement.query(
        // get the child component instance
        By.css('app-hearing-file')
      ).componentInstance as HearingFileComponent;
      fixture.detectChanges();
    });

    it('should set case and hearing child variables correctly', () => {
      let c;
      parentComponent.case$.subscribe({
        next: (data: CaseData) => {
          c = data;
          expect(childComponent.case).toEqual(c);
        },
      });

      let h;
      if (parentComponent.hearing$) {
        parentComponent.hearing$.subscribe({
          next: (data: HearingData | undefined) => {
            h = data;
            expect(childComponent.hearing).toEqual(h);
          },
        });
      }
    });
  });

  describe('Parent case and hearings', () => {
    it('should load via api', () => {
      expect(component.case$).toEqual(cd);
      expect(component.hearing$).toEqual(shd);
    });
  });

  describe('#onEventsSelected', () => {
    it('should set the start and end times from selected entries', () => {
      const mockAudioAndEvents = [
        {
          id: 1,
          timestamp: '2023-07-31T01:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
          type: HearingEventTypeEnum.Event,
        },
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          type: HearingEventTypeEnum.Audio,
          timestamp: '2023-07-31T02:32:24.620Z',
        },
        {
          id: 2,
          timestamp: '2023-07-31T03:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
          type: HearingEventTypeEnum.Event,
        },
      ];
      component.onEventsSelected(mockAudioAndEvents);
      expect(component.requestAudioTimes);
    });
    it('should set request Audio times to undefined if audio and Events are empty', () => {
      const mockAudioAndEvents: HearingAudioEventViewModel[] = [];
      component.onEventsSelected(mockAudioAndEvents);
      expect(component.requestAudioTimes).toEqual(undefined);
    });
  });

  describe('#onAudioRequest', () => {
    it('should set the request object and set the state variable', () => {
      const mockRequestObject: requestPlaybackAudioDTO = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      component.onAudioRequest(mockRequestObject);
      expect(component.requestObject).toEqual(mockRequestObject);
      expect(component.state).toEqual('OrderSummary');
    });
  });
});
