import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WorkRequest } from '@portal-types/index';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { YourWorkComponent } from './your-work.component';

const MOCK_WORK_REQUESTS: WorkRequest[] = [
  {
    transcriptionId: 1,
    caseId: 3,
    caseNumber: 'T2023453422',
    courthouseName: 'Reading',
    hearingDate: DateTime.fromISO('2023-08-06T00:00:00'),
    transcriptionType: 'Court Log',
    status: 'With Transcriber',
    urgency: { transcription_urgency_id: 1, description: 'Overnight', priority_order: 1 },
    requestedTs: DateTime.fromISO('2023-08-12T13:00:00'),
    approvedTs: DateTime.fromISO('2024-06-26T15:00:00'),
    stateChangeTs: DateTime.fromISO('2023-08-13T13:00:00'),
    isManual: true,
  },
  {
    transcriptionId: 1,
    caseId: 3,
    caseNumber: 'T2023453436',
    courthouseName: 'Swansea',
    hearingDate: DateTime.fromISO('2023-06-10T00:00:00'),
    transcriptionType: 'Court Log',
    status: 'Complete',
    urgency: { transcription_urgency_id: 1, description: 'Up to 3 Working days', priority_order: 1 },
    requestedTs: DateTime.fromISO('2023-06-26T13:00:00'),
    approvedTs: DateTime.fromISO('2024-06-26T15:00:00'),
    stateChangeTs: DateTime.fromISO('2023-06-27T13:00:00'),
    isManual: true,
  },
];

const fakeTranscriptService = {
  assignedRequests$: of(MOCK_WORK_REQUESTS),
};

const fakeTranscriptServiceNoRequests = {
  assignedRequests$: of([]),
};

describe('YourWorkComponent', () => {
  let component: YourWorkComponent;
  let fixture: ComponentFixture<YourWorkComponent>;

  describe('When Work Requests returned', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [YourWorkComponent],
        providers: [
          DatePipe,
          { provide: TranscriptionService, useValue: fakeTranscriptService },
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([]),
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
      expect(cells.length).toEqual(8);
      expect(cells[0].textContent).toEqual('T2023453422');
      expect(cells[1].textContent).toEqual('Reading');
      expect(cells[2].textContent).toEqual('06 Aug 2023');
      expect(cells[3].textContent).toEqual('Court Log');
      expect(cells[4].textContent).toEqual('12 Aug 2023 13:00');
      expect(cells[5].textContent).toEqual('26 Jun 2024 15:00');
      expect(cells[6].textContent).toEqual('Overnight');
      expect(cells[7].textContent).toEqual('View');
    });
  });

  describe('When NO work requests returned', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [YourWorkComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          DatePipe,
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
