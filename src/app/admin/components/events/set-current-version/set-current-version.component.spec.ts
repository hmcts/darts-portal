import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { Navigation, provideRouter, Router } from '@angular/router';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { HeaderService } from '@services/header/header.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { SetCurrentVersionComponent } from './set-current-version.component';

describe('SetCurrentVersionComponent', () => {
  let component: SetCurrentVersionComponent;
  let fixture: ComponentFixture<SetCurrentVersionComponent>;
  let router: Router;
  let routerNavigateSpy: jest.SpyInstance;
  let mockHeaderService: Partial<HeaderService>;
  let mockEventsFacadeService: Partial<EventsFacadeService>;

  const mockEvent = {
    id: 123,
    eventTs: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
    eventMapping: {
      name: 'Test Event',
    },
    courthouse: { id: 1, displayName: 'Test Courthouse' },
    courtroom: { id: 1, name: 'Test Courtroom' },
    text: 'This is a test event.',
  } as unknown as Event;

  beforeEach(async () => {
    mockHeaderService = { hideNavigation: jest.fn() };
    mockEventsFacadeService = {
      getEvent: jest.fn().mockReturnValue(of(mockEvent)),
      setCurrentEventVersion: jest.fn().mockReturnValue(of({})),
    } as Partial<EventsFacadeService>;

    await TestBed.configureTestingModule({
      imports: [SetCurrentVersionComponent],
      providers: [
        { provide: HeaderService, useValue: mockHeaderService },
        { provide: EventsFacadeService, useValue: mockEventsFacadeService },
        DatePipe,
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetCurrentVersionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSubmitted true and navigate on setCurrentVersion', () => {
    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { selectedEventId: 123 } } } as unknown as Navigation);
    fixture.detectChanges();

    component.setCurrentVersion();

    expect(component.isSubmitted).toBe(true);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: expect.anything(),
      queryParams: { versionSet: true },
    });
  });

  it('should navigate back if no selectedEventId is present', () => {
    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { randomValue: 1 } } } as unknown as Navigation);
    fixture.detectChanges();

    component.selectedEventId = undefined;
    component.ngOnInit();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: expect.anything() });
  });
});
