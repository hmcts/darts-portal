import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { DatatableColumn } from '@core-types/index';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ShowVersionsComponent } from './show-versions.component';
import { By } from '@angular/platform-browser';
import { EventVersionData } from '@admin-types/events';

jest.mock('@facades/events/events-facade.service');
describe('ShowVersionsComponent', () => {
  let component: ShowVersionsComponent;
  let fixture: ComponentFixture<ShowVersionsComponent>;
  let mockEventsFacadeService: jest.Mocked<EventsFacadeService>;

  const mockCurrentVersion: EventVersionData = {
    id: 1,
    event_id: 1001,
    timestamp: DateTime.now(),
    name: 'Event Mapping 1',
    courthouse: 'Central Courthouse',
    courtroom: 'Room A',
    text: 'Test event text',
  };

  const mockPreviousVersions: EventVersionData[] = [
    {
      id: 2,
      event_id: 1001,
      timestamp: DateTime.now().minus({ days: 2 }),
      name: 'Event Mapping 2',
      courthouse: 'Central Courthouse',
      courtroom: 'Room A',
      text: 'Previous event text',
    },
  ];

  let mockEventVersions: { currentVersion: EventVersionData; previousVersions: EventVersionData[] };

  beforeEach(async () => {
    mockEventVersions = {
      currentVersion: mockCurrentVersion,
      previousVersions: mockPreviousVersions,
    };

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

  it('should display source event ID when available', () => {
    const sourceEventId = fixture.debugElement.query(By.css('#sourceEventId')).nativeElement.textContent;
    expect(sourceEventId).toBe(mockEventVersions.currentVersion.event_id?.toString());
  });

  it('should display source event ID = 0', () => {
    mockEventVersions.currentVersion.event_id = 0;
    mockEventsFacadeService = {
      getEventVersions: jest.fn().mockReturnValue(of(mockEventVersions)),
    } as unknown as jest.Mocked<EventsFacadeService>;

    fixture.detectChanges();

    const sourceEventId = fixture.debugElement.query(By.css('#sourceEventId')).nativeElement.textContent;
    expect(sourceEventId).toBe('0');
  });

  it('should display source event ID Not set when not available', () => {
    mockEventVersions.currentVersion.event_id = undefined;
    mockEventsFacadeService = {
      getEventVersions: jest.fn().mockReturnValue(of(mockEventVersions)),
    } as unknown as jest.Mocked<EventsFacadeService>;

    fixture.detectChanges();

    const sourceEventId = fixture.debugElement.query(By.css('#sourceEventId')).nativeElement.textContent;
    expect(sourceEventId).toBe('Not set');
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

  it('should display no data message when currentVersion is empty', () => {
    mockEventsFacadeService.getEventVersions.mockReturnValue(
      of({
        currentVersion: null,
        previousVersions: mockPreviousVersions,
      })
    );

    fixture = TestBed.createComponent(ShowVersionsComponent);
    fixture.detectChanges();

    const previousVersionsTable = fixture.nativeElement.querySelector('#currentVersionTable');
    expect(previousVersionsTable.textContent).toContain('There is no current version of this event.');
  });

  it('should display no data message when previousVersions is empty', () => {
    mockEventsFacadeService.getEventVersions.mockReturnValue(
      of({
        currentVersion: mockCurrentVersion,
        previousVersions: [],
      })
    );

    fixture = TestBed.createComponent(ShowVersionsComponent);
    fixture.detectChanges();

    const previousVersionsTable = fixture.nativeElement.querySelector('#previousVersionsTable');
    expect(previousVersionsTable.textContent).toContain('There are no previous versions of this event.');
  });
});
