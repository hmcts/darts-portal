import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DateTime } from 'luxon';
import { BasicEventDetailsComponent } from './basic-event-details.component';

describe('BasicEventDetailsComponent', () => {
  let component: BasicEventDetailsComponent;
  let fixture: ComponentFixture<BasicEventDetailsComponent>;

  const mockEvent: Event = {
    isDataAnonymised: false,
    text: 'this event text is not anonymised',
    eventMapping: { name: 'name' },
    courthouse: { displayName: 'Test Courthouse' },
    courtroom: { name: 'Test Courtroom' },
    eventTs: DateTime.fromISO('2024-05-05T11:00:00Z'),
    cases: [
      { id: '1', caseNumber: 'CN123', courthouse: { displayName: 'Court A' } },
      { id: '2', caseNumber: null, courthouse: { displayName: null } },
    ],
    hearings: [
      {
        id: 'H1',
        caseId: '1',
        caseNumber: 'CN456',
        hearingDate: '2024-05-06',
        courthouse: { displayName: 'Court B' },
        courtroom: { name: 'Room 1' },
      },
      {
        id: 'H2',
        caseId: '2',
        caseNumber: null,
        hearingDate: '2024-05-07',
        courthouse: { displayName: null },
        courtroom: { name: null },
      },
    ],
  } as unknown as Event;

  const setup = (event: Event) => {
    TestBed.configureTestingModule({
      imports: [BasicEventDetailsComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicEventDetailsComponent);
    fixture.componentRef.setInput('event', event);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create the component', () => {
    setup(mockEvent);
    expect(component).toBeTruthy();
  });

  describe('anonymised text', () => {
    it('should show anonymised text when event is anonymised', () => {
      setup({ ...mockEvent, isDataAnonymised: true });
      expect(fixture.nativeElement.textContent).toContain('This event has been anonymised in line with HMCTS policy');
    });

    it('should show event text when event is not anonymised', () => {
      setup({ ...mockEvent, isDataAnonymised: false });
      expect(fixture.nativeElement.textContent).toContain('this event text is not anonymised');
    });
  });

  describe('associated cases', () => {
    it('should correctly transform associated cases from event', () => {
      setup(mockEvent);
      expect(component.associatedCases).toEqual([
        { caseId: '1', caseNumber: 'CN123', courthouse: 'Court A' },
        { caseId: '2', caseNumber: 'Unknown', courthouse: 'Unknown' },
      ]);
    });

    it('should return an empty array if event has no cases', () => {
      setup({ ...mockEvent, cases: undefined });
      expect(component.associatedCases).toEqual([]);
    });
  });

  describe('associated hearings', () => {
    it('should correctly transform associated hearings from event', () => {
      setup(mockEvent);
      expect(component.associatedHearings).toEqual([
        {
          caseId: '1',
          hearingId: 'H1',
          caseNumber: 'CN456',
          hearingDate: '2024-05-06',
          courthouse: 'Court B',
          courtroom: 'Room 1',
        },
        {
          caseId: '2',
          hearingId: 'H2',
          caseNumber: 'Unknown',
          hearingDate: '2024-05-07',
          courthouse: 'Unknown',
          courtroom: 'Unknown',
        },
      ]);
    });

    it('should return an empty array if event has no hearings', () => {
      setup({ ...mockEvent, hearings: undefined });
      expect(component.associatedHearings).toEqual([]);
    });
  });

  describe('ngOnInit', () => {
    it('should populate associated cases and hearings on init', () => {
      setup(mockEvent);
      expect(component.associatedCases.length).toBe(2);
      expect(component.associatedHearings.length).toBe(2);
    });

    it('should set empty arrays if event has no cases or hearings', () => {
      setup({ ...mockEvent, cases: [], hearings: [] });
      expect(component.associatedCases).toEqual([]);
      expect(component.associatedHearings).toEqual([]);
    });
  });
});
