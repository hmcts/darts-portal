import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UserTranscriptionRequest } from '@darts-types/user-transcription-request.interface';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { of } from 'rxjs';
import { TranscriptionsComponent } from './transcriptions.component';

const MOCK_REQUESTS = {
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
      urgency: '3 Working days',
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
      urgency: '3 Working days',
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
      urgency: '3 Working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
  ],
};

const mockTranscriptionService = {
  getTranscriptionRequests: () => of(MOCK_REQUESTS),
};

describe('TranscriptionsComponent', () => {
  let component: TranscriptionsComponent;
  let fixture: ComponentFixture<TranscriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranscriptionsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TranscriptionService, useValue: mockTranscriptionService },
        { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
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
    component.data$.subscribe((data) => (requests = data.inProgessRequests));
    expect(requests.length).toEqual(2);
    expect(requests.find((r) => r.status === 'Awaiting Authorisation')).toBeTruthy();
    expect(requests.find((r) => r.status === 'With Transcriber')).toBeTruthy();
  });

  it('should filter "Ready" requests', () => {
    let requests: UserTranscriptionRequest[] = [];
    fixture.detectChanges();
    component.data$.subscribe((data) => (requests = data.completedRequests));
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
    expect(cells[7].textContent).toEqual('3 Working days');
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
    expect(cells[5].textContent).toEqual('Complete');
    expect(cells[6].textContent).toEqual('3 Working days');
    expect(cells[7].textContent).toEqual('View');
  });
});
