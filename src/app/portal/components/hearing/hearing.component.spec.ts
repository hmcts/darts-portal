import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Case,
  Hearing,
  HearingEventTypeEnum,
  HearingPageState,
  PostAudioRequest,
  Transcript,
} from '@portal-types/index';
import { DateTime } from 'luxon';
import { Observable, of, throwError } from 'rxjs';
import { UserState } from 'src/app/core/models/user/user-state.interface';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { AppInsightsService } from 'src/app/core/services/app-insights/app-insights.service';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { AudioEventRow } from 'src/app/portal/models/hearing/hearing-audio-event.interface';
import { CaseService } from 'src/app/portal/services/case/case.service';
import { HearingService } from 'src/app/portal/services/hearing/hearing.service';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { HearingComponent } from './hearing.component';
import { MappingService } from '@services/mapping/mapping.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { AnnotationService } from '@services/annotation/annotation.service';
import { Annotations } from '@portal-types/annotations/annotations.type';

describe('HearingComponent', () => {
  const fakeAppInsightsService = {};
  let httpClientSpy: HttpClient;
  let mockRouter: Router;
  let caseService: CaseService;
  let hearingService: HearingService;
  let fakeUserService: Partial<UserService>;
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;
  const fakeFileDownloadService = {
    saveAs: jest.fn(),
  };
  const fakeAnnotationService = {
    downloadAnnotationDocument: jest.fn().mockReturnValue(of({})),
    downloadAnnotationTemplate: jest.fn().mockReturnValue(of({})),
    deleteAnnotation: jest.fn().mockReturnValue(of({})),
  };

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: {
          userId: 123,
          userName: 'dev@local',
          roles: [
            {
              roleId: 123,
              roleName: 'local dev',
              permissions: [
                {
                  permissionId: 1,
                  permissionName: 'local dev permissions',
                },
              ],
            },
          ],
        },
      },
      params: {
        caseId: '1',
        hearing_id: '1',
      },
      queryParams: { tab: 'Transcripts', startTime: '2024-01-01', endTime: '2024-01-02' },
    },
  };

  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };

  const cd = of({ id: 1, number: '12345', courthouse: 'Reading', judges: ['Judy'] }) as Observable<Case>;
  const hd = of([
    { id: 1, date: DateTime.fromISO('2023-02-21'), judges: ['Joseph', 'Judy'], courtroom: '3', transcriptCount: 99 },
    { id: 2, date: DateTime.fromISO('2023-03-21'), judges: ['Joseph', 'Kennedy'], courtroom: '1', transcriptCount: 12 },
  ]) as Observable<Hearing[]>;
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

  const mockTranscript: Observable<Transcript[]> = of([
    {
      id: 1,
      hearingId: 2,
      hearingDate: DateTime.fromISO('2023-10-12'),
      type: 'Sentencing remarks',
      requestedOn: DateTime.fromISO('2023-10-12T00:00:00Z'),
      requestedByName: 'Joe Bloggs',
      status: 'With Transcriber',
    },
    {
      id: 1,
      hearingId: 2,
      hearingDate: DateTime.fromISO('2023-10-12'),
      type: 'Sentencing remarks',
      requestedOn: DateTime.fromISO('2023-10-12T00:00:00Z'),
      requestedByName: 'Joe Bloggs',
      status: 'With Transcriber',
    },
  ]);

  const mockAnnotations: Observable<Annotations[]> = of([
    {
      annotationId: 1,
      hearingId: 2,
      hearingDate: DateTime.fromISO('2024-01-01'),
      annotationTs: DateTime.fromISO('2024-01-01'),
      annotationText: 'text',
      annotationDocumentId: 1,
      fileName: 'document.docx',
      fileType: 'DOC',
      uploadedBy: 'Mr Test',
      uploadedTs: DateTime.fromISO('2024-01-01'),
    },
  ]);

  const shd = of({
    id: 1,
    date: DateTime.fromISO('2023-02-21'),
    judges: ['Joseph', 'Judy'],
    courtroom: '3',
    transcriptCount: 99,
  }) as Observable<Hearing>;

  const mockUser: Observable<UserState> = of({
    userId: 123,
    userName: 'localdev01',
    roles: [
      {
        roleId: 123,
        roleName: 'REQUESTER',
        permissions: [],
      },
    ],
  });

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as Router;

    caseService = new CaseService(httpClientSpy);
    hearingService = new HearingService(httpClientSpy);

    jest.spyOn(caseService, 'getCase').mockReturnValue(cd);
    jest.spyOn(caseService, 'getCaseHearings').mockReturnValue(hd);
    jest.spyOn(caseService, 'getHearingTranscripts').mockReturnValue(mockTranscript);
    jest.spyOn(caseService, 'getHearingById').mockReturnValue(shd);
    jest.spyOn(hearingService, 'getAudio').mockReturnValue(ad);
    jest.spyOn(hearingService, 'getEvents').mockReturnValue(ed);
    jest.spyOn(hearingService, 'getAnnotations').mockReturnValue(mockAnnotations);

    fakeUserService = { userProfile$: mockUser, isTranscriber: () => true, isJudge: () => true, isAdmin: () => true };

    TestBed.configureTestingModule({
      imports: [HearingComponent, HearingFileComponent, RouterTestingModule],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: CaseService, useValue: caseService },
        { provide: HearingService, useValue: hearingService },
        { provide: HeaderService },
        { provide: UserService, useValue: fakeUserService },
        { provide: FileDownloadService, useValue: fakeFileDownloadService },
        { provide: AnnotationService, useValue: fakeAnnotationService },
        { provide: MappingService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AppConfigService, useValue: appConfigServiceMock },
        { provide: DatePipe },
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
        next: (data: Case) => {
          c = data;
          expect(childComponent.case).toEqual(c);
        },
      });

      let h;
      if (parentComponent.hearing$) {
        parentComponent.hearing$.subscribe({
          next: (data: Hearing | undefined) => {
            h = data;
            expect(childComponent.hearing).toEqual(h);
          },
        });
      }
    });
  });

  describe('Parent case and hearings', () => {
    it('should load via api', () => {
      expect(component.case$).toBeDefined();
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
      expect(component.audioTimes);
    });
    it('should set request Audio times to undefined if audio and Events are empty', () => {
      const mockAudioAndEvents: AudioEventRow[] = [];
      component.onEventsSelected(mockAudioAndEvents);
      expect(component.audioTimes).toEqual(null);
    });
  });

  describe('#onAudioRequest', () => {
    it('should set the request object and set the state variable', () => {
      const mockRequestObject: PostAudioRequest = {
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

  describe('state setter', () => {
    it('should call the header service with true when the state is default', () => {
      const headerServiceSpy = jest.spyOn(component.headerService, 'showNavigation');
      const value: HearingPageState = 'Default';
      component.state = value;
      expect(headerServiceSpy).toHaveBeenCalled();
    });
    describe('should hide navigation when ', () => {
      it('state is Order Summary', () => {
        const headerServiceSpy = jest.spyOn(component.headerService, 'hideNavigation');
        const value: HearingPageState = 'OrderSummary';
        component.state = value;
        expect(headerServiceSpy).toHaveBeenCalled();
      });
      it('state is Order Confirmation', () => {
        const headerServiceSpy = jest.spyOn(component.headerService, 'hideNavigation');
        const value: HearingPageState = 'OrderConfirmation';
        component.state = value;
        expect(headerServiceSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#onStageChanged', () => {
    it('should set the state to orderSummary', () => {
      component.onStateChanged('OrderSummary');
      expect(component.state).toEqual('OrderSummary');
    });
    it('should set the state to orderConfirmation', () => {
      component.onStateChanged('OrderConfirmation');
      expect(component.state).toEqual('OrderConfirmation');
    });
  });

  describe('#onBack', () => {
    it('should change state to Default', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      component.onBack(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(component.state).toEqual('Default');
    });
  });

  describe('#onOrderConfirm', () => {
    it('should set the values of state and requestId', () => {
      jest.spyOn(hearingService, 'requestAudio').mockReturnValue(
        of({
          request_id: 1234,
          case_id: 'T4565443',
          courthouse_name: 'Swansea',
          defendants: ['Derek Defender'],
          hearing_date: '2023-09-20',
          start_time: '2023-09-01T02:00:00Z',
          end_time: '2023-09-01T15:32:24Z',
        })
      );
      const mockRequestObject: PostAudioRequest = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      component.onOrderConfirm(mockRequestObject);
      expect(component.state).toEqual('OrderConfirmation');
      expect(component.requestId).toEqual(1234);
    });

    describe('#onDownloadClicked', () => {
      const blob = new Blob();
      const fileName = 'filename.docx';
      it('should call saveAs with blob and filename', () => {
        jest.spyOn(fakeAnnotationService, 'downloadAnnotationDocument').mockReturnValue(of(blob));
        component.onDownloadClicked(1, 1, fileName);
        expect(fakeFileDownloadService.saveAs).toHaveBeenCalledWith(blob, fileName);
      });
    });

    describe('#downloadAnnotationTemplate', () => {
      it("should call saveAs with blob and filename with today's date if no date provided", () => {
        const blob = new Blob();
        jest.spyOn(fakeAnnotationService, 'downloadAnnotationTemplate').mockReturnValue(of(blob));
        const todaysDate = DateTime.now().toFormat('yyyyMMdd');
        component.downloadAnnotationTemplate('CASEID', undefined);
        const expectedFilename = `Annotations_for_CASEID_on_${todaysDate}.docx`;
        expect(fakeFileDownloadService.saveAs).toHaveBeenCalledWith(blob, expectedFilename);
      });

      it('should call saveAs with blob and filename', () => {
        const blob = new Blob();
        jest.spyOn(fakeAnnotationService, 'downloadAnnotationTemplate').mockReturnValue(of(blob));
        const hearingDate = DateTime.fromISO('2024-01-01');
        component.downloadAnnotationTemplate('CASEID', hearingDate);
        const expectedFilename = 'Annotations_for_CASEID_on_20240101.docx';
        expect(fakeFileDownloadService.saveAs).toHaveBeenCalledWith(blob, expectedFilename);
      });
    });

    describe('#filterRestrictionsByHearingId', () => {
      it('should filter items with same hearing ID and blank out event timestamp', () => {
        const reportingRestriction = [
          {
            hearing_id: 1,
            event_id: 2,
            event_name: 'EVENT_NAME',
            event_text: 'EVENT_TEXT',
            event_ts: '2024-01-01',
          },
          {
            hearing_id: 2,
            event_id: 2,
            event_name: 'DIFFERENT_EVENT_NAME',
            event_text: 'DIFFERENT_EVENT_TEXT',
            event_ts: '2024-01-01',
          },
        ];
        const result = component.filterRestrictionsByHearingId(reportingRestriction, 1);
        expect(result).toStrictEqual([
          { event_id: 2, event_name: 'EVENT_NAME', event_text: 'EVENT_TEXT', event_ts: '', hearing_id: 1 },
        ]);
      });
    });

    it('should set the value of state when 403 encountered', () => {
      const errorResponse = new HttpErrorResponse({ error: 'Forbidden', status: 403, url: '/api/audio-requests' });
      jest.spyOn(hearingService, 'requestAudio').mockReturnValue(throwError(() => errorResponse));
      const mockRequestObject: PostAudioRequest = {
        hearing_id: 3,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      component.onOrderConfirm(mockRequestObject);
      expect(component.state).toEqual('OrderFailure');
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should set the value of state when 409 encountered', () => {
      const errorResponse = new HttpErrorResponse({ error: 'Conflict', status: 409, url: '/api/audio-requests' });
      jest.spyOn(hearingService, 'requestAudio').mockReturnValue(throwError(() => errorResponse));
      const mockRequestObject: PostAudioRequest = {
        hearing_id: 3,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      component.onOrderConfirm(mockRequestObject);
      expect(component.state).toEqual('OrderFailure');
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('#onValidationError', () => {
    it('should set the error summary and focus on the first error summary message', () => {
      const mockErrorSummary = [
        {
          fieldId: 'start-time-hour-input',
          message: 'You must include a start time for your audio recording',
        },
        {
          fieldId: 'end-time-hour-input',
          message: 'You must include an end time for your audio recording',
        },
        {
          fieldId: 'playback-radio',
          message: 'You must select a request type',
        },
      ];
      component.onValidationError(mockErrorSummary);
      expect(component.errorSummary).toEqual(mockErrorSummary);
    });
  });

  describe('#onDeleteClicked', () => {
    it('should set the ID in the selectedAnnotationsforDeletion array', () => {
      component.onDeleteClicked(123);
      expect(component.selectedAnnotationsforDeletion).toEqual([123]);
    });
  });

  describe('#onDeleteConfirmed', () => {
    it('should use the IDs in the selectedAnnotationsforDeletion array and call the backend', () => {
      const annotationId = 123;
      component.onDeleteClicked(annotationId);
      component.onDeleteConfirmed();
      expect(fakeAnnotationService.deleteAnnotation).toHaveBeenCalledWith(annotationId);
    });
  });

  describe('#onDeleteConfirmed', () => {
    it('should clear the ID in selectedAnnotationsforDeletion array', () => {
      const ids = [123, 321];
      component.selectedAnnotationsforDeletion = ids;
      expect(component.selectedAnnotationsforDeletion).toEqual(ids);
      component.onDeleteCancelled();
      expect(component.selectedAnnotationsforDeletion).toEqual([]);
    });
  });

  describe('#ngOnInit', () => {
    it('should set the tab to transcripts if the url contains ?tab=Transcripts', () => {
      component.ngOnInit();
      expect(component.defaultTab).toEqual('Transcripts');
    });
    it('should set the tab to annotations if the url contains ?tab=Annotations', () => {
      mockActivatedRoute.snapshot.queryParams = { tab: 'Annotations', startTime: '2024-01-01', endTime: '2024-01-02' };
      component.ngOnInit();
      expect(component.defaultTab).toEqual('Annotations');
    });
  });
});
