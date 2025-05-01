import { AdminCase } from '@admin-types/case/case.type';
import { User } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { PaginatedCaseEvents } from '@portal-types/events/paginated-case-events.type';
import { Hearing } from '@portal-types/hearing';
import { TranscriptsRow } from '@portal-types/transcriptions';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CaseService } from '@services/case/case.service';
import { MappingService } from '@services/mapping/mapping.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { CaseComponent } from './case.component';

jest.mock('@services/admin-case/admin-case.service');
jest.mock('@services/user-admin/user-admin.service');
jest.mock('@services/case/case.service');
jest.mock('@services/mapping/mapping.service');

describe('CaseComponent', () => {
  let component: CaseComponent;
  let fixture: ComponentFixture<CaseComponent>;
  let mockAdminCaseService: jest.Mocked<AdminCaseService>;
  let mockUserAdminService: jest.Mocked<UserAdminService>;
  let mockCaseService: jest.Mocked<CaseService>;
  let mockMappingService: jest.Mocked<MappingService>;

  const mockCaseFile = {
    id: 1,
    caseNumber: 'CASE1001',
    createdById: 101,
    lastModifiedById: 102,
    caseStatus: 'Open',
  };

  const mockUsers = [
    { id: 101, fullName: 'Alice Johnson' },
    { id: 102, fullName: 'Bob Smith' },
  ] as unknown as User[];

  const mockAppConfigService = {
    getAppConfig: jest.fn().mockReturnValue({ pagination: { courtLogEventsPageLimit: 500 } }),
  };

  beforeEach(async () => {
    mockAdminCaseService = {
      getCase: jest.fn().mockReturnValue(of(mockCaseFile)),
    } as unknown as jest.Mocked<AdminCaseService>;

    mockUserAdminService = {
      getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
    } as unknown as jest.Mocked<UserAdminService>;

    mockCaseService = {
      getCaseHearings: jest.fn().mockReturnValue(of([{ id: 1, hearingType: 'Trial' }] as unknown as Hearing[])),
      getCaseTranscripts: jest.fn().mockReturnValue(of([{ some: 'transcriptData' }])),
      getCaseEventsPaginated: jest.fn().mockReturnValue(of({ data: [], totalItems: 0, currentPage: 1 })),
    } as unknown as jest.Mocked<CaseService>;

    mockMappingService = {
      mapTranscriptRequestToRows: jest.fn().mockReturnValue([{ id: 'row1' }] as unknown as TranscriptsRow[]),
    } as unknown as jest.Mocked<MappingService>;

    await TestBed.configureTestingModule({
      imports: [CaseComponent],
      providers: [
        { provide: AdminCaseService, useValue: mockAdminCaseService },
        { provide: UserAdminService, useValue: mockUserAdminService },
        { provide: CaseService, useValue: mockCaseService },
        { provide: MappingService, useValue: mockMappingService },
        DatePipe,
        { provide: AppConfigService, useValue: mockAppConfigService },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('caseFile$ Observable', () => {
    it('should fetch case file and map user names correctly', (done) => {
      component.caseFile$?.subscribe((caseFile) => {
        expect(caseFile).toEqual({
          ...mockCaseFile,
          createdBy: 'Alice Johnson',
          lastModifiedBy: 'Bob Smith',
          dataAnonymisedBy: 'System',
          caseDeletedBy: 'System',
        });
        done();
      });

      expect(mockAdminCaseService.getCase).toHaveBeenCalledWith(component.caseId());
      expect(mockUserAdminService.getUsersById).toHaveBeenCalledWith([101, 102]);
    });

    it('should handle missing users and set fallback values', (done) => {
      mockUserAdminService.getUsersById.mockReturnValue(of([])); // No users returned

      component.caseFile$?.subscribe((caseFile) => {
        expect(caseFile).toEqual({
          ...mockCaseFile,
          createdBy: 'System',
          lastModifiedBy: 'System',
          dataAnonymisedBy: 'System',
          caseDeletedBy: 'System',
        });
        done();
      });

      expect(mockAdminCaseService.getCase).toHaveBeenCalledWith(component.caseId());
      expect(mockUserAdminService.getUsersById).toHaveBeenCalledWith([101, 102]);
    });
  });

  it('should render app-case-additional-details directly when isDataAnonymised is true', async () => {
    const mockAnonymisedCaseFile = {
      ...mockCaseFile,
      isDataAnonymised: true,
    };

    mockAdminCaseService.getCase.mockReturnValue(of(mockAnonymisedCaseFile as AdminCase));
    mockUserAdminService.getUsersById.mockReturnValue(of([]));

    fixture = TestBed.createComponent(CaseComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // app-tabs should not be present
    const tabs = fixture.debugElement.query(By.css('app-tabs#case-tabs'));
    expect(tabs).toBeNull();

    // app-case-additional-details should be present
    const details = fixture.debugElement.query(By.css('app-case-additional-details'));
    expect(details).toBeTruthy();
  });

  it('should fetch hearings and expose them through hearings$', (done) => {
    component.hearings$.subscribe((hearings) => {
      expect(hearings).toEqual([{ id: 1, hearingType: 'Trial' }]);
      done();
    });

    expect(mockCaseService.getCaseHearings).toHaveBeenCalledWith(component.caseId());
  });

  it('should fetch and map transcripts through transcripts$', (done) => {
    component.transcripts$.subscribe((transcripts) => {
      expect(mockMappingService.mapTranscriptRequestToRows).toHaveBeenCalledWith([{ some: 'transcriptData' }]);
      expect(transcripts).toEqual([{ id: 'row1' }]);
      done();
    });

    expect(mockCaseService.getCaseTranscripts).toHaveBeenCalledWith(component.caseId());
  });

  it('should combine caseFile, hearings, and transcripts into data$', (done) => {
    component.data$.subscribe((data) => {
      expect(data).toEqual({
        caseFile: {
          ...mockCaseFile,
          createdBy: 'Alice Johnson',
          lastModifiedBy: 'Bob Smith',
          caseDeletedBy: 'System',
          dataAnonymisedBy: 'System',
        },
        hearings: [{ id: 1, hearingType: 'Trial' }],
        transcripts: [{ id: 'row1' }],
      });
      done();
    });
  });

  it('should load events and update signals', () => {
    const mockEvents = {
      data: [{ id: 1, eventName: 'Mock Event' }],
      totalItems: 123,
      currentPage: 2,
    } as unknown as PaginatedCaseEvents;

    jest.spyOn(component['caseService'], 'getCaseEventsPaginated').mockReturnValue(of(mockEvents));

    component.onPageChange(2);

    expect(component.events()).toEqual(mockEvents.data);
    expect(component.eventsTotalItems()).toBe(123);
    expect(component.eventsCurrentPage()).toBe(2);
  });

  it('should update sort state and reload events on sort change', () => {
    const sort = { sortBy: 'timestamp', sortOrder: 'desc' as const };
    const loadEventsSpy = jest.spyOn(component as unknown as { loadEvents: () => void }, 'loadEvents');

    component.onSortChange(sort);

    expect(component.eventsSort()).toEqual(sort);
    expect(loadEventsSpy).toHaveBeenCalled();
  });

  it('should update page and reload events on page change', () => {
    const loadEventsSpy = jest.spyOn(component as unknown as { loadEvents: () => void }, 'loadEvents');

    component.onPageChange(3);

    expect(component.eventsCurrentPage()).toBe(3);
    expect(loadEventsSpy).toHaveBeenCalled();
  });
});
