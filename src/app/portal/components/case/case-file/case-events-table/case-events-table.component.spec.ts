import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { AppConfigService } from '@services/app-config/app-config.service';
import { CaseEventsTableComponent } from './case-events-table.component';

describe('CaseEventsTableComponent', () => {
  let component: CaseEventsTableComponent;
  let fixture: ComponentFixture<CaseEventsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseEventsTableComponent],
      providers: [
        {
          provide: AppConfigService,
          useValue: {
            getAppConfig: jest.fn().mockReturnValue({
              pagination: {
                courtLogEventsPageLimit: 5,
              },
            }),
          },
        },
        DatePipe,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseEventsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable pagination if events exceed eventsPerPage limit', () => {
    const mockEvents = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      hearing_id: 1,
      hearing_date: '2024-04-24',
      timestamp: '2024-04-24T14:30:00Z',
      name: `Event ${i + 1}`,
      text: `Text ${i + 1}`,
    }));

    fixture.componentRef.setInput('events', mockEvents);
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.eventsPerPage).toBe(5);
    expect(component.pagination).toBe(true);
  });

  it('should disable pagination if events are within the eventsPerPage limit', () => {
    const mockEvents = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      hearing_id: 1,
      hearing_date: '2024-04-24',
      timestamp: '2024-04-24T14:30:00Z',
      name: `Event ${i + 1}`,
      text: `Text ${i + 1}`,
    }));

    fixture.componentRef.setInput('events', mockEvents);
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.eventsPerPage).toBe(5);
    expect(component.pagination).toBe(false);
  });
});
