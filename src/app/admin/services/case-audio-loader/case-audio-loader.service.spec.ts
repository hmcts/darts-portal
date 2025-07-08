import { CaseAudio } from '@admin-types/case/case-audio/case-audio.type';
import { TestBed } from '@angular/core/testing';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { CaseAudioLoaderService } from './case-audio-loader.service';

describe('CaseAudioLoaderService', () => {
  let service: CaseAudioLoaderService;
  let mockAdminCaseService: jest.Mocked<AdminCaseService>;

  const mockAudios: CaseAudio[] = [
    {
      audioId: 1,
      courtroom: 'Courtroom 1',
      startTime: DateTime.fromISO('2023-10-01T10:00:00Z'),
      endTime: DateTime.fromISO('2023-10-01T11:00:00Z'),
      channel: 1,
    },
  ];

  const mockResponse = {
    data: mockAudios,
    totalItems: 100,
    currentPage: 2,
  };

  beforeEach(() => {
    mockAdminCaseService = {
      getCaseAudio: jest.fn().mockReturnValue(of(mockResponse)),
    } as unknown as jest.Mocked<AdminCaseService>;

    TestBed.configureTestingModule({
      providers: [CaseAudioLoaderService, { provide: AdminCaseService, useValue: mockAdminCaseService }],
    });

    service = TestBed.inject(CaseAudioLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load audio data and update all provided setters', () => {
    const setEvents = jest.fn();
    const setTotalItems = jest.fn();
    const setCurrentPage = jest.fn();

    service.load(123, {
      page: 2,
      pageSize: 50,
      sort: { sortBy: 'startTime', sortOrder: 'asc' },
      setEvents,
      setTotalItems,
      setCurrentPage,
    });

    expect(mockAdminCaseService.getCaseAudio).toHaveBeenCalledWith(123, {
      page_number: 2,
      page_size: 50,
      sort_by: 'startTime',
      sort_order: 'asc',
    });

    expect(setEvents).toHaveBeenCalledWith(mockAudios);
    expect(setTotalItems).toHaveBeenCalledWith(100);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
  });

  it('should call getCaseAudio without sort if sort is null', () => {
    const setEvents = jest.fn();
    const setTotalItems = jest.fn();
    const setCurrentPage = jest.fn();

    service.load(456, {
      page: 1,
      pageSize: 25,
      sort: null,
      setEvents,
      setTotalItems,
      setCurrentPage,
    });

    expect(mockAdminCaseService.getCaseAudio).toHaveBeenCalledWith(456, {
      page_number: 1,
      page_size: 25,
      sort_by: undefined,
      sort_order: undefined,
    });

    expect(setEvents).toHaveBeenCalledWith(mockAudios);
    expect(setTotalItems).toHaveBeenCalledWith(100);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
  });
});
