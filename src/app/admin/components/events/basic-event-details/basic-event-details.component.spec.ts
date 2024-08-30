import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { BasicEventDetailsComponent } from './basic-event-details.component';

describe('BasicEventDetailsComponent', () => {
  let component: BasicEventDetailsComponent;
  let fixture: ComponentFixture<BasicEventDetailsComponent>;

  const event = {
    id: 0,
    text: 'text',
    eventMapping: {
      name: 'eventMapping',
    },
    courthouse: {
      displayName: 'courthouse',
    },
    courtroom: {
      name: 'courtroom',
    },
    createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
  } as Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicEventDetailsComponent],
      providers: [{ provide: DatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicEventDetailsComponent);
    fixture.componentRef.setInput('event', event);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
