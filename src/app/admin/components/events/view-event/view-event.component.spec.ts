import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
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
  eventStatus: 4,
  eventTs: DateTime.fromISO('2024-05-05T11:00:00Z'),
  createdAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
  createdById: 0,
  lastModifiedAt: DateTime.fromISO('2024-05-05T11:00:00Z'),
  lastModifiedById: 0,
  isCurrentVersion: true,
  cases: [],
  hearings: [],
};

describe('ViewEventComponent', () => {
  let component: ViewEventComponent;
  let fixture: ComponentFixture<ViewEventComponent>;

  const setup = (isAdmin: boolean, event: Event, isManualDeletionEnabled = true, isEventObfuscationEnabled = true) => {
    TestBed.configureTestingModule({
      imports: [ViewEventComponent],
      providers: [
        { provide: EventsFacadeService, useValue: { getEvent: jest.fn().mockReturnValue(of(event)) } },
        { provide: UserService, useValue: { isAdmin: jest.fn().mockReturnValue(isAdmin) } },
        {
          provide: FeatureFlagService,
          useValue: {
            isManualDeletionEnabled: jest.fn().mockReturnValue(isManualDeletionEnabled),
            isEventObfuscationEnabled: jest.fn().mockReturnValue(isEventObfuscationEnabled),
          },
        },
        DatePipe,
        provideRouter([]),
      ],
    });

    fixture = TestBed.createComponent(ViewEventComponent);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    setup(true, mockEvent);
    expect(component.id()).toBe(1);
    expect(component.event()).toEqual(mockEvent);
    expect(component).toBeTruthy();
  });

  it('basic and advanced tabs for admin users', () => {
    setup(true, mockEvent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(TabsComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(BasicEventDetailsComponent))).toBeTruthy();
  });

  it('No tabs for non-admin users', () => {
    setup(false, mockEvent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(TabsComponent))).toBeFalsy();
    expect(fixture.debugElement.query(By.directive(BasicEventDetailsComponent))).toBeTruthy();
  });

  it('calls getEvent', () => {
    setup(true, mockEvent);
    expect(component.eventsFacadeService.getEvent).toHaveBeenCalledWith(1);
  });

  it('shows expired banner when data is annonymised', () => {
    setup(true, { ...mockEvent, isDataAnonymised: true });
    fixture.detectChanges();
    const anonymisedBanner = fixture.debugElement.query(By.directive(GovukBannerComponent));
    expect(anonymisedBanner).toBeTruthy();
    expect(anonymisedBanner.nativeElement.textContent).toContain('This event text has been anonymised');
  });

  it('does not show expired banner when data is not annonymised', () => {
    setup(true, { ...mockEvent, isDataAnonymised: false });
    fixture.detectChanges();
    const anonymisedBanner = fixture.debugElement.query(By.directive(GovukBannerComponent));
    expect(anonymisedBanner).toBeFalsy();
  });

  it('shows obfuscate button when user is admin and event is not anonymised', () => {
    setup(true, mockEvent);
    fixture.detectChanges();
    const obfuscateButton = fixture.debugElement.query(By.css('#obfuscate-button'));
    expect(obfuscateButton).toBeTruthy();
  });

  it('does not show obfuscate button when user is not admin', () => {
    setup(false, mockEvent);
    fixture.detectChanges();
    const obfuscateButton = fixture.debugElement.query(By.css('#obfuscate-button'));
    expect(obfuscateButton).toBeFalsy();
  });

  it('does not show obfuscate button when event is anonymised', () => {
    setup(true, { ...mockEvent, isDataAnonymised: true });
    fixture.detectChanges();
    const obfuscateButton = fixture.debugElement.query(By.css('#obfuscate-button'));
    expect(obfuscateButton).toBeFalsy();
  });

  it('navigates to obfuscate page when obfuscate button is clicked', () => {
    setup(true, mockEvent);
    fixture.detectChanges();
    jest.spyOn(component.router, 'navigate');
    const obfuscateButton = fixture.debugElement.query(By.css('#obfuscate-button'));
    obfuscateButton.nativeElement.click();
    expect(component.router.navigate).toHaveBeenCalledWith(['/admin/events', 1, 'obfuscate']);
  });

  it('does not show obfuscate button when feature flag is disabled', () => {
    setup(true, mockEvent, false, false);
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.query(By.css('#obfuscate-button'));
    expect(deleteButton).toBeFalsy();
  });
});
