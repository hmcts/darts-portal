import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingComponent } from './hearing.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { AppInsightsService } from '../../services/app-insights/app-insights.service';
import { CaseData } from 'src/app/types/case';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CaseService } from 'src/app/services/case/case.service';
import { ErrorHandlerService } from 'src/app/services/error/error-handler.service';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';
import { HearingData } from 'src/app/types/hearing';
import { of } from 'rxjs';

describe('HearingComponent', () => {
  let c!: CaseData;
  let h!: HearingData;
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
  let caseService: CaseService;
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;
  const caseDataService: CaseDataService = new CaseDataService();

  const cd = { case_id: 1, case_number: '12345', courthouse: 'Reading', judges: ['Judy'] } as CaseData;
  const hd = [
    { id: 1, date: '2023-02-21', judges: ['Joseph', 'Judy'], courtroom: '3', transcript_count: 99 },
    { id: 2, date: '2023-03-21', judges: ['Joseph', 'Kennedy'], courtroom: '1', transcript_count: 12 },
  ] as HearingData[];

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;
    errorHandlerSpy = {
      err: jest.fn(),
    } as unknown as ErrorHandlerService;
    caseService = new CaseService(httpClientSpy, errorHandlerSpy);

    jest.spyOn(caseService, 'getCaseFile').mockReturnValue(of(cd));
    jest.spyOn(caseService, 'getCaseHearings').mockReturnValue(of(hd));
    jest.spyOn(caseDataService, 'getCase').mockReturnValue(cd);
    jest.spyOn(caseDataService, 'getHearingById').mockReturnValue(hd[0]);

    TestBed.configureTestingModule({
      imports: [HearingComponent, HearingFileComponent, RouterTestingModule, HttpClientModule],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: CaseService, useValue: caseService },
        { provide: CaseDataService, useValue: caseDataService },
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

      parentComponent.case = cd;
      parentComponent.hearing = hd[0];
      childComponent = fixture.debugElement.query(
        // get the child component instance
        By.css('app-hearing-file')
      ).componentInstance as HearingFileComponent;
      fixture.detectChanges();
    });

    it('should set case to the case parameter', () => {
      expect(childComponent.case).toEqual(parentComponent.case);
      expect(childComponent.hearing).toEqual(parentComponent.hearing);
    });
  });

  describe('Parent case and hearings', () => {
    // beforeEach(() => {
    //   component.case = c;
    //   component.hearing = h;
    // });

    it('should load via shared service on init during normal use', () => {
      expect(component.case).toEqual(cd);
      expect(component.hearing).toEqual(hd[0]);
    });

    // it('should load via api on init during events like refresh', () => {
    //   // component.ngOnInit()

    //   jest.spyOn(component, 'loadFromApi');
    //   jest.spyOn(component, 'loadData');
    //   // component.hearing = hd[0];

    //   jest.spyOn(caseService, 'getCaseFile').mockReturnValue(of(cd));
    //   jest.spyOn(caseService, 'getCaseHearings').mockReturnValue(of(hd));
    //   jest.spyOn(caseDataService, 'getHearingById').mockReturnValue(hd[0]);

    //   //Prevent shared service returning hearing data so it's forced to use API
    //   //Reset to undefined

    //   // caseDataService.setCase(c);
    //   // caseDataService.setHearings([h]);
    //   // component.case = caseDataService.z;
    //   // component.hearing = h;
    //   // jest.restoreAllMocks();
    //   // jest.spyOn(caseDataService, 'getHearingById').mockReturnValue(undefined);
    //   //Now return hearings as expected

    //   expect(component.case).toEqual(cd);
    //   expect(component.hearing).toEqual(hd[0]);
    //   // expect(component.loadFromApi).toHaveBeenCalled();
    //   expect(component.loadData).toHaveBeenCalled();
    // });
  });
});
