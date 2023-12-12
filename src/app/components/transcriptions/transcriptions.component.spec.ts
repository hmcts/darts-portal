import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';
import { UserTranscriptionRequest, YourTranscriptionRequests } from '@darts-types/user-transcription-request.interface';
import { AppConfigService } from '@services/app-config/app-config.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';
import { map, of } from 'rxjs';
import { TranscriptionsComponent } from './transcriptions.component';

const MOCK_URGENCIES: TranscriptionUrgency[] = [
  { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
  { transcription_urgency_id: 2, description: 'Up to 2 working days', priority_order: 2 },
  { transcription_urgency_id: 3, description: 'Up to 3 working days', priority_order: 3 },
  { transcription_urgency_id: 4, description: 'Up to 7 working days', priority_order: 4 },
  { transcription_urgency_id: 5, description: 'Up to 12 working days', priority_order: 5 },
];

const MOCK_REQUESTS: YourTranscriptionRequests = {
  requester_transcriptions: [
    {
      transcription_id: 1,
      case_id: 72345,
      case_number: 'T12345',
      courthouse_name: 'Swansea',
      hearing_date: '2023-06-10T00:00:00Z',
      transcription_type: 'Court log',
      status: 'Awaiting Authorisation',
      urgency: 'Overnight',
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 2,
      case_id: 72346,
      case_number: 'T12345',
      courthouse_name: 'NEWCASTLE',
      hearing_date: '2023-06-10T00:00:00Z',
      transcription_type: 'Court log',
      status: 'With Transcriber',
      urgency: 'Up to 3 working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 2,
      case_id: 72346,
      case_number: 'T12345',
      courthouse_name: 'Newcastle',
      hearing_date: '2023-06-10T00:00:00Z',
      transcription_type: 'Court log',
      status: 'Complete',
      urgency: 'Up to 3 working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 2,
      case_id: 72346,
      case_number: 'T12345',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-10T00:00:00Z',
      transcription_type: 'Court log',
      status: 'Rejected',
      urgency: 'Overnight',
      requested_ts: '2023-06-26T13:00:00Z',
    },
  ],
  approver_transcriptions: [
    {
      transcription_id: 1,
      case_id: 72345,
      case_number: 'T12345',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-10T00:00:00Z',
      transcription_type: 'Court log',
      status: 'Complete',
      urgency: 'Up to 3 working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
  ],
};

const mockTranscriptionService = {
  getTranscriptionRequests: () => of(MOCK_REQUESTS),
  deleteRequest: () => of({} as Response),
  getUrgencies: () => of(MOCK_URGENCIES),
  mapTranscriptUrgencies: () => {
    return map((requests: UserTranscriptionRequest[]) =>
      requests.map((r) => ({ ...r, urgency: MOCK_URGENCIES.find((u) => u.description === r.urgency) }))
    );
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

describe('TranscriptionsComponent', () => {
  let component: TranscriptionsComponent;
  let fixture: ComponentFixture<TranscriptionsComponent>;
  let userServiceStub: Partial<UserService>;

  beforeEach(() => {
    userServiceStub = {
      isRequester: () => true,
      isApprover: () => true,
      isJudge: () => false,
      isTranscriber: () => false,
    };

    TestBed.configureTestingModule({
      imports: [TranscriptionsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TranscriptionService, useValue: mockTranscriptionService },
        { provide: UserService, useValue: userServiceStub },
        { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
        { provide: AppConfigService, useValue: appConfigServiceMock },
      ],
    });

    fixture = TestBed.createComponent(TranscriptionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should filter "In Progress" requests', () => {
    let requests: UserTranscriptionRequest[] = [];
    fixture.detectChanges();
    component.requesterRequests$.subscribe((data) => (requests = data.inProgressRequests));
    expect(requests.length).toEqual(2);
    expect(requests.find((r) => r.status === 'Awaiting Authorisation')).toBeTruthy();
    expect(requests.find((r) => r.status === 'With Transcriber')).toBeTruthy();
  });

  it('should filter "Ready" requests', () => {
    let requests: UserTranscriptionRequest[] = [];
    fixture.detectChanges();
    component.requesterRequests$.subscribe((data) => (requests = data.completedRequests));
    expect(requests.length).toEqual(2);
    expect(requests.find((r) => r.status === 'Complete')).toBeTruthy();
    expect(requests.find((r) => r.status === 'Rejected')).toBeTruthy();
  });

  it('render in progress requests table', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('#in-progress-table');
    expect(table).toBeTruthy();
    const tableRows = table.querySelectorAll('tr');
    expect(tableRows.length).toEqual(3);
    const firstRow = tableRows[1];
    expect(firstRow).toBeTruthy();
    const cells = firstRow.querySelectorAll('td');
    expect(cells.length).toEqual(7);
    expect(cells[0].textContent).toEqual('T12345');
    expect(cells[1].textContent).toEqual('Swansea');
    expect(cells[2].textContent).toEqual('10 Jun 2023');
    expect(cells[3].textContent).toEqual('Court log');
    expect(cells[4].textContent).toEqual('26 Jun 2023 13:00');
    expect(cells[5].textContent).toEqual('Awaiting Authorisation');
    expect(cells[6].textContent).toEqual('Overnight');
  });

  it('render ready requests table', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const table = compiled.querySelector('#ready-table');
    expect(table).toBeTruthy();
    const tableRows = table.querySelectorAll('tr');
    expect(tableRows.length).toEqual(3);
    const firstRow = tableRows[1];
    expect(firstRow).toBeTruthy();
    const cells = firstRow.querySelectorAll('td');
    expect(cells.length).toEqual(9);
    expect(cells[1].textContent).toEqual('T12345');
    expect(cells[2].textContent).toEqual('Newcastle');
    expect(cells[3].textContent).toEqual('10 Jun 2023');
    expect(cells[4].textContent).toEqual('Court log');
    expect(cells[5].textContent).toEqual('26 Jun 2023 13:00');
    expect(cells[6].textContent).toEqual('Complete');
    expect(cells[7].textContent).toEqual('Up to 3 working days');
    expect(cells[8].textContent).toEqual('View');
  });

  it('render approver requests table', () => {
    fixture.detectChanges();

    const tab = fixture.debugElement.queryAll(By.css('a.moj-sub-navigation__link'))[1].nativeElement;
    tab.click();

    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('#approver-table');

    expect(table).toBeTruthy();
    const tableRows = table.querySelectorAll('tr');
    expect(tableRows.length).toEqual(2);
    const firstRow = tableRows[1];
    expect(firstRow).toBeTruthy();
    const cells = firstRow.querySelectorAll('td');
    expect(cells.length).toEqual(8);
    expect(cells[0].textContent).toEqual('T12345');
    expect(cells[1].textContent).toEqual('Cardiff');
    expect(cells[2].textContent).toEqual('10 Jun 2023');
    expect(cells[3].textContent).toEqual('Court log');
    expect(cells[4].textContent).toEqual('26 Jun 2023 13:00');
    expect(cells[5].textContent).toEqual('1');
    expect(cells[6].textContent).toEqual('Up to 3 working days');
    expect(cells[7].textContent).toEqual('View');
  });

  describe('onDeleteClicked', () => {
    it('should set isDeleting to true if requests are selected', () => {
      fixture.detectChanges();
      component.selectedRequests = [{} as UserTranscriptionRequest];
      component.onDeleteClicked();
      expect(component.isDeleting).toEqual(true);
    });
    it('should not set isDeleting to true if no requests are selected', () => {
      fixture.detectChanges();
      component.selectedRequests = [];
      component.onDeleteClicked();
      expect(component.isDeleting).toEqual(false);
    });
  });

  describe('onDeleteConfirmed', () => {
    it('should call deleteRequest for each selected request', () => {
      fixture.detectChanges();
      const spy = jest.spyOn(component.transcriptService, 'deleteRequest');
      component.selectedRequests = [
        { transcription_id: 1 } as UserTranscriptionRequest,
        { transcription_id: 2 } as UserTranscriptionRequest,
      ];
      component.onDeleteConfirmed();

      expect(spy).toHaveBeenCalledWith([1, 2]);
    });
    it('should set isDeleting to false', () => {
      fixture.detectChanges();
      component.selectedRequests = [{} as UserTranscriptionRequest];
      component.isDeleting = true;
      component.onDeleteConfirmed();
      expect(component.isDeleting).toEqual(false);
    });
  });

  describe('#onDeleteCancelled', () => {
    it('should set isDeleting to false', () => {
      fixture.detectChanges();
      component.isDeleting = true;
      component.onDeleteCancelled();
      expect(component.isDeleting).toEqual(false);
    });
  });

  it('Tabs if both APPROVER and REQUESTOR', () => {
    fixture.detectChanges();

    component.isRequester = true;
    component.isApprover = true;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelector('app-tabs');
    expect(tabs).toBeTruthy();
  });

  it('No tabs if REQUESTOR only', () => {
    fixture.detectChanges();

    component.isRequester = true;
    component.isApprover = false;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelector('app-tabs');
    expect(tabs).toBeFalsy();
  });

  it('No tabs if APPROVER only', () => {
    fixture.detectChanges();

    component.isRequester = false;
    component.isApprover = true;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelector('app-tabs');
    expect(tabs).toBeFalsy();
  });

  it('Requestor view and no tabs if JUDGE only', () => {
    fixture.detectChanges();

    component.isRequester = false;
    component.isApprover = false;
    component.isJudge = true;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelector('app-tabs');
    const table = compiled.querySelector('#in-progress-table');
    expect(tabs).toBeFalsy();
    expect(table).toBeTruthy();
  });

  it('Tabbed view if JUDGE and APPROVER', () => {
    fixture.detectChanges();

    component.isRequester = false;
    component.isApprover = true;
    component.isJudge = true;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelector('app-tabs');
    const table = compiled.querySelector('#in-progress-table');
    expect(tabs).toBeTruthy();
    expect(table).toBeTruthy();
  });
});
