import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { UserTranscriptsComponent } from './user-transcripts.component';

describe('UserTranscriptsComponent', () => {
  let component: UserTranscriptsComponent;
  let fixture: ComponentFixture<UserTranscriptsComponent>;

  const mockTranscriptionAdminService = {
    getTranscriptionStatuses: jest.fn().mockReturnValue(
      of([
        { id: 1, type: 'type1', displayName: 'Status 1' },
        { id: 2, type: 'type2', displayName: 'Status 2' },
      ])
    ),
    getTranscriptiptionRequests: jest.fn().mockReturnValue(
      of([
        {
          id: 1,
          courthouse: { id: 1 },
          status: { id: 1 },
          caseNumber: '123',
          hearingDate: DateTime.fromISO('2023-01-01T00:00:00Z'),
          requestedAt: DateTime.fromISO('2023-06-01T00:00:00Z'),
          isManualTranscription: false,
        },
        {
          id: 2,
          courthouse: { id: 2 },
          status: { id: 2 },
          caseNumber: '456',
          hearingDate: DateTime.fromISO('2023-02-01T00:00:00Z'),
          requestedAt: DateTime.fromISO('2023-07-01T00:00:00Z'),
          isManualTranscription: true,
        },
      ])
    ),
  };

  const mockCourthouseService = {
    getCourthouses: jest.fn().mockReturnValue(
      of([
        { id: 1, display_name: 'Courthouse 1', courthouse_name: 'Main Courthouse' },
        { id: 2, display_name: 'Courthouse 2', courthouse_name: 'Secondary Courthouse' },
      ])
    ),
  };

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        userId: 123,
      },
    },
  } as unknown as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: TranscriptionAdminService, useValue: mockTranscriptionAdminService },
        { provide: CourthouseService, useValue: mockCourthouseService },
        DatePipe,
        LuxonDatePipe,
      ],

      imports: [UserTranscriptsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.value).toEqual({ showAll: false });
  });

  it('should call getCourthouses and getTranscriptionStatuses on init', () => {
    expect(mockCourthouseService.getCourthouses).toHaveBeenCalled();
    expect(mockTranscriptionAdminService.getTranscriptionStatuses).toHaveBeenCalled();
  });

  it('should calculate six months prior date correctly', () => {
    const expectedDate = DateTime.now().minus({ months: 6 }).toFormat('yyyy-MM-dd');
    expect(component.sixMonthsPrevious).toBe(expectedDate);
  });

  it('should fetch user transcripts based on showAll value', () => {
    component.form.controls.showAll.setValue(true);
    fixture.detectChanges();

    component.userTranscripts$.subscribe((transcripts) => {
      expect(mockTranscriptionAdminService.getTranscriptiptionRequests).toHaveBeenCalledWith(123, undefined);
      expect(transcripts!.length).toBe(2);
    });

    component.form.controls.showAll.setValue(false);
    fixture.detectChanges();

    component.userTranscripts$.subscribe((transcripts) => {
      expect(mockTranscriptionAdminService.getTranscriptiptionRequests).toHaveBeenCalledWith(
        123,
        component.sixMonthsPrevious
      );
      expect(transcripts!.length).toBe(2);
    });
  });
});
