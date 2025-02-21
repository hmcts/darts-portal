import { Event } from '@admin-types/events/event';
import { EventVersions } from '@admin-types/events/event-versions';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { DatatableColumn } from '@core-types/index';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ShowVersionsComponent } from './show-versions.component';

jest.mock('@facades/events/events-facade.service');
describe('ShowVersionsComponent', () => {
  let component: ShowVersionsComponent;
  let fixture: ComponentFixture<ShowVersionsComponent>;
  let mockEventsFacadeService: jest.Mocked<EventsFacadeService>;

  const mockCurrentVersion: Event = {
    id: 1,
    documentumId: 'doc123',
    sourceId: 1001,
    messageId: 'msg-001',
    text: 'Test event text',
    eventMapping: { id: 101, name: 'Event Mapping 1' },
    isLogEntry: false,
    courthouse: { id: 1, displayName: 'Central Courthouse' },
    courtroom: { id: 10, name: 'Room A' },
    version: 'v1.0',
    chronicleId: 'chron-001',
    antecedentId: 'ant-001',
    isDataAnonymised: false,
    eventTs: DateTime.now(),
    createdAt: DateTime.now().minus({ days: 1 }),
    createdById: 100,
    lastModifiedAt: DateTime.now(),
    lastModifiedById: 101,
    isCurrentVersion: true,
  };

  const mockPreviousVersions: Event[] = [
    {
      id: 2,
      documentumId: 'doc124',
      sourceId: 1002,
      messageId: 'msg-002',
      text: 'Previous event text',
      eventMapping: { id: 102, name: 'Event Mapping 2' },
      isLogEntry: false,
      courthouse: { id: 1, displayName: 'Central Courthouse' },
      courtroom: { id: 10, name: 'Room A' },
      version: 'v0.9',
      chronicleId: 'chron-002',
      antecedentId: 'ant-002',
      isDataAnonymised: false,
      eventTs: DateTime.now().minus({ days: 2 }),
      createdAt: DateTime.now().minus({ days: 3 }),
      createdById: 102,
      lastModifiedAt: DateTime.now().minus({ days: 1 }),
      lastModifiedById: 103,
      isCurrentVersion: false,
    },
  ];

  const mockEventVersions: EventVersions = {
    currentVersion: mockCurrentVersion,
    previousVersions: mockPreviousVersions,
  };

  beforeEach(async () => {
    mockEventsFacadeService = {
      getEventVersions: jest.fn().mockReturnValue(of(mockEventVersions)),
    } as unknown as jest.Mocked<EventsFacadeService>;

    await TestBed.configureTestingModule({
      imports: [ShowVersionsComponent],
      providers: [
        DatePipe,
        { provide: EventsFacadeService, useValue: mockEventsFacadeService },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowVersionsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default columns defined', () => {
    const expectedColumns: DatatableColumn[] = [
      { name: 'Event ID', prop: 'id', sortable: true },
      { name: 'Timestamp', prop: 'timestamp', sortable: true },
      { name: 'Name', prop: 'name', sortable: true },
      { name: 'Courthouse', prop: 'courthouse', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'Text', prop: 'text', sortable: true },
    ];
    expect(component.columns).toEqual(expectedColumns);
  });

  it('should fetch event versions and update computed properties', () => {
    fixture.detectChanges();

    expect(component.currentVersion()).toEqual(mockEventVersions.currentVersion);
    expect(component.previousVersions()).toEqual(mockEventVersions.previousVersions);
    expect(component.isLoading()).toBe(false);
  });
});
