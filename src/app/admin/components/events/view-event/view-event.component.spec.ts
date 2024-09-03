import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TabsComponent } from '@common/tabs/tabs.component';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { BasicEventDetailsComponent } from '../basic-event-details/basic-event-details.component';
import { ViewEventComponent } from './view-event.component';

const mockEvent: Event = {
  id: 0,
  documentumId: '',
  sourceId: 0,
  messageId: '',
  text: '',
  eventMapping: {
    id: 0,
    name: '',
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
  createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
  createdById: 0,
  lastModifiedAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
  lastModifiedById: 0,
};

describe('ViewEventComponent', () => {
  let component: ViewEventComponent;
  let fixture: ComponentFixture<ViewEventComponent>;

  const setup = (isAdmin: boolean, event: Event) => {
    TestBed.configureTestingModule({
      imports: [ViewEventComponent],
      providers: [
        { provide: EventsFacadeService, useValue: { getEvent: jest.fn().mockReturnValue(of(event)) } },
        { provide: UserService, useValue: { isAdmin: jest.fn().mockReturnValue(isAdmin) } },
        DatePipe,
        provideRouter([]),
      ],
    });

    fixture = TestBed.createComponent(ViewEventComponent);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  };

  it('should create', () => {
    const { component } = setup(true, mockEvent);
    expect(component.id()).toBe(1);
    expect(component.event()).toEqual(mockEvent);
    expect(component).toBeTruthy;
  });

  it('basic and advanced tabs for admin users', () => {
    const { fixture } = setup(true, mockEvent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(TabsComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(BasicEventDetailsComponent))).toBeTruthy();
  });

  it('No tabs for non-admin users', () => {
    const { fixture } = setup(false, mockEvent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(TabsComponent))).toBeFalsy();
    expect(fixture.debugElement.query(By.directive(BasicEventDetailsComponent))).toBeTruthy();
  });

  it('calls getEvent', () => {
    const { component } = setup(true, mockEvent);
    expect(component.eventsFacadeService.getEvent).toHaveBeenCalledWith(1);
  });
});
