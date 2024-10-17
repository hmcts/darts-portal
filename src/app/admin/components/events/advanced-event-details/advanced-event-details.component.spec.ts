import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { AdvancedEventDetailsComponent } from './advanced-event-details.component';

describe('AdvancedEventDetailsComponent', () => {
  let component: AdvancedEventDetailsComponent;
  let fixture: ComponentFixture<AdvancedEventDetailsComponent>;

  const event: Event = {
    id: 0,
    documentumId: '',
    sourceId: 0,
    messageId: '',
    text: '',
    eventMapping: {
      id: 0,
    },
    isLogEntry: false,
    courthouse: {
      id: 0,
      displayName: '',
    },
    courtroom: {
      id: 0,
      name: '',
    },
    version: '',
    chronicleId: '',
    antecedentId: '',
    isDataAnonymised: false,
    eventTs: DateTime.fromISO('2024-05-05T11:00:00Z'),
    createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
    createdById: 0,
    lastModifiedAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
    lastModifiedById: 0,
    caseExpiredAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
    isCurrentVersion: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedEventDetailsComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedEventDetailsComponent);
    fixture.componentRef.setInput('event', event);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
