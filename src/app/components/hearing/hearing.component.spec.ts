import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingComponent } from './hearing.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { AppInsightsService } from '../../services/app-insights/app-insights.service';
import { CaseData } from 'src/app/types/case';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CaseService } from 'src/app/services/case/case.service';
import { HearingData } from 'src/app/types/hearing';
import { Observable, of } from 'rxjs';

describe('HearingComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let caseService: CaseService;
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;

  const cd = of({ case_id: 1, case_number: '12345', courthouse: 'Reading', judges: ['Judy'] }) as Observable<CaseData>;
  const hd = of([
    { id: 1, date: '2023-02-21', judges: ['Joseph', 'Judy'], courtroom: '3', transcript_count: 99 },
    { id: 2, date: '2023-03-21', judges: ['Joseph', 'Kennedy'], courtroom: '1', transcript_count: 12 },
  ]) as Observable<HearingData[]>;

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

    jest.spyOn(caseService, 'getCase').mockReturnValue(cd);
    jest.spyOn(caseService, 'getCaseHearings').mockReturnValue(hd);
    jest.spyOn(caseService, 'getHearingById').mockReturnValue(shd);

    TestBed.configureTestingModule({
      imports: [HearingComponent, HearingFileComponent, RouterTestingModule, HttpClientModule],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: CaseService, useValue: caseService },
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
          type: 'event',
        },
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          type: 'audio',
          timestamp: '2023-07-31T02:32:24.620Z',
        },
        {
          id: 2,
          timestamp: '2023-07-31T03:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
      ];
      component.onEventsSelected(mockAudioAndEvents);
      expect(component.requestAudioTimes);
    });
  });
});
