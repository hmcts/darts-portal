import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Event } from '@admin-types/events';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LoadingComponent } from '@common/loading/loading.component';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { HeaderService } from '@services/header/header.service';
import { of } from 'rxjs';
import { ObfuscateEventTextComponent } from './obfuscate-event-text.component';

const mockEvent: Event = { text: 'Unobfuscated text' } as Event;

describe('ObfuscateEventTextComponent', () => {
  let component: ObfuscateEventTextComponent;
  let fixture: ComponentFixture<ObfuscateEventTextComponent>;

  const setup = (event: Event) => {
    TestBed.configureTestingModule({
      imports: [ObfuscateEventTextComponent],
      providers: [
        {
          provide: EventsFacadeService,
          useValue: {
            getEvent: jest.fn().mockReturnValue(of(event)),
            obfuscateEventText: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: AdminSearchService,
          useValue: {
            fetchNewEvents: { set: jest.fn() },
          },
        },
        { provide: HeaderService, useValue: { hideNavigation: jest.fn() } },
        provideRouter([]),
        provideHttpClient(),
      ],
    });

    fixture = TestBed.createComponent(ObfuscateEventTextComponent);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    setup(mockEvent);
    expect(component.id()).toBe(1);
    expect(component.event()).toEqual(mockEvent);
    expect(component).toBeTruthy();
    expect(component.headerService.hideNavigation).toHaveBeenCalled();
  });

  it('should call obfuscateEventText on continue', fakeAsync(() => {
    setup(mockEvent);
    const obfuscateEventTextSpy = jest.spyOn(component.eventsFacadeService, 'obfuscateEventText');
    const navigateBackToEventSpy = jest.spyOn(component, 'navigateBackToEvent').mockImplementation(() => {});

    component.onContinue();
    tick();

    expect(obfuscateEventTextSpy).toHaveBeenCalledWith(1);
    expect(navigateBackToEventSpy).toHaveBeenCalled();
  }));

  it('should navigate back to event', () => {
    setup(mockEvent);
    const routerSpy = jest.spyOn(component.router, 'navigate');

    component.navigateBackToEvent();

    expect(routerSpy).toHaveBeenCalledWith(['/admin/events', 1], { queryParams: { isObfuscationSuccess: true } });
  });

  it('show loading component while loading', () => {
    setup(null as unknown as Event);
    expect(fixture.debugElement.query(By.directive(LoadingComponent))).toBeTruthy();
  });

  it('hide loading component after loading', () => {
    setup(mockEvent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(LoadingComponent))).toBeFalsy();
  });

  it('display event text', () => {
    setup(mockEvent);
    fixture.detectChanges();
    const textElement = fixture.debugElement.query(By.css('#event-text')).nativeElement;
    expect(textElement.textContent).toContain('Unobfuscated text');
  });
});
