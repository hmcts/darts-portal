import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { BasicEventDetailsComponent } from './basic-event-details.component';

describe('BasicEventDetailsComponent', () => {
  let component: BasicEventDetailsComponent;
  let fixture: ComponentFixture<BasicEventDetailsComponent>;

  const mockEvent: Event = {
    isDataAnonymised: false,
    text: 'this event text is not anonymised',
    eventMapping: { name: 'name' },
    courthouse: { displayName: 'courthouse' },
    courtroom: { name: 'courtroom' },
    eventTs: DateTime.fromISO('2024-05-05T11:00:00Z'),
  } as Event;

  const setup = (event: Event) => {
    TestBed.configureTestingModule({
      imports: [BasicEventDetailsComponent],
      providers: [{ provide: DatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicEventDetailsComponent);
    fixture.componentRef.setInput('event', event);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    setup(mockEvent);
    expect(component).toBeTruthy();
  });

  describe('anonymised text', () => {
    it('show anonymised text when event is anonymised', () => {
      setup({ ...mockEvent, isDataAnonymised: true });
      expect(fixture.nativeElement.textContent).toContain('This event has been anonymised in line with HMCTS policy');
    });

    it('show event text when event is not anonymised', () => {
      setup({ ...mockEvent, isDataAnonymised: false });
      expect(fixture.nativeElement.textContent).toContain('this event text is not anonymised');
    });
  });
});
