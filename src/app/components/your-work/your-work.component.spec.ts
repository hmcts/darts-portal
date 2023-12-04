import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkRequest } from '@darts-types/index';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { of } from 'rxjs';

import { RouterTestingModule } from '@angular/router/testing';
import { YourWorkComponent } from './your-work.component';

const MOCK_WORK_REQUESTS: WorkRequest[] = [
  {
    transcription_id: 1,
    case_id: 3,
    case_number: 'T2023453422',
    courthouse_name: 'Reading',
    hearing_date: '2023-08-06T00:00:00Z',
    transcription_type: 'Court Log',
    status: 'With Transcriber',
    urgency: 'Overnight',
    requested_ts: '2023-08-12T13:00:00Z',
    state_change_ts: '2023-08-13T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 1,
    case_id: 3,
    case_number: 'T2023453436',
    courthouse_name: 'Swansea',
    hearing_date: '2023-06-10T00:00:00Z',
    transcription_type: 'Court Log',
    status: 'Complete',
    urgency: 'Up to 3 Working days',
    requested_ts: '2023-06-26T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: true,
  },
];

const fakeTranscriptService = {
  getWorkRequests: () => of(MOCK_WORK_REQUESTS),
};

const fakeTranscriptServiceNoRequests = {
  getWorkRequests: () => of([]),
};

describe('YourWorkComponent', () => {
  let component: YourWorkComponent;
  let fixture: ComponentFixture<YourWorkComponent>;

  describe('When Work Requests returned', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [YourWorkComponent, HttpClientTestingModule, RouterTestingModule],
        providers: [
          DatePipe,
          { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
          { provide: TranscriptionService, useValue: fakeTranscriptService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(YourWorkComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('render to do work table', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const title = compiled.querySelectorAll('.govuk-heading-m')[0];
      expect(title).toBeTruthy();
      expect(title.textContent).toEqual('To do');

      const table = compiled.querySelector('#todoTable');
      expect(table).toBeTruthy();
      const tableRows = table.querySelectorAll('tr');
      expect(tableRows.length).toEqual(2);
      const firstRow = tableRows[1];
      expect(firstRow).toBeTruthy();
      const cells = firstRow.querySelectorAll('td');
      expect(cells.length).toEqual(7);
      expect(cells[0].textContent).toEqual('T2023453422');
      expect(cells[1].textContent).toEqual('Reading');
      expect(cells[2].textContent).toEqual('06 Aug 2023');
      expect(cells[3].textContent).toEqual('Court Log');
      expect(cells[4].textContent).toEqual('12 Aug 2023 13:00');
      expect(cells[5].textContent).toEqual('Overnight');
      expect(cells[6].textContent).toEqual('View');
    });
  });

  describe('When Work Requests returned', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [YourWorkComponent, HttpClientTestingModule],
        providers: [
          DatePipe,
          { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'utc' } },
          { provide: TranscriptionService, useValue: fakeTranscriptServiceNoRequests },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(YourWorkComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('render error message when no data', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const errorMessage = compiled.querySelector('#no-data-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toEqual('There are no outstanding transcript requests');
    });
  });
});
