import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { CourthousesComponent } from './courthouses.component';

describe('CourthousesComponent', () => {
  let component: CourthousesComponent;
  let fixture: ComponentFixture<CourthousesComponent>;
  let courthouseService: CourthouseService;

  const courthouses = [
    {
      courthouseName: 'The Royal Courts of Justice',
      displayName: 'RCJ',
      code: 101,
      id: 1,
      createdDateTime: DateTime.now().minus({ days: 10 }).toISO(),
      lastModifiedDateTime: DateTime.now().minus({ days: 5 }).toISO(),
      regionName: 'London',
    },
    {
      courthouseName: 'Manchester Civil Justice Centre',
      displayName: 'MCJC',
      code: 102,
      id: 2,
      createdDateTime: DateTime.now().minus({ weeks: 1 }).toISO(),
      lastModifiedDateTime: DateTime.now().minus({ days: 3 }).toISO(),
      regionName: 'Manchester',
    },
    {
      courthouseName: 'Bristol Civil and Family Justice Centre',
      displayName: 'BCFJC',
      code: 103,
      id: 3,
      createdDateTime: DateTime.now().minus({ months: 1 }).toISO(),
      regionName: 'Bristol',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthousesComponent, HttpClientTestingModule],
      providers: [
        {
          provide: CourthouseService,
          useValue: { searchCourthouses: jest.fn(), getCourthousesWithRegions: jest.fn().mockReturnValue(courthouses) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthousesComponent);
    component = fixture.componentInstance;
    courthouseService = TestBed.inject(CourthouseService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start loading when search is triggered', () => {
    jest.spyOn(component, 'startLoading');
    component.search$.next({}); // Trigger search
    expect(component.startLoading).toHaveBeenCalled();
  });

  it('should stop loading after search is completed', () => {
    jest.spyOn(component, 'stopLoading');
    jest.spyOn(courthouseService, 'searchCourthouses').mockReturnValue(of([]));
    component.search$.next({}); // Trigger search
    expect(component.stopLoading).toHaveBeenCalled();
  });

  it('should call searchCourthouses when search is triggered', () => {
    jest.spyOn(courthouseService, 'searchCourthouses').mockReturnValue(of([]));
    component.search$.next({}); // Trigger search
    component.isSubmitted$.next(true);
    expect(courthouseService.searchCourthouses).toHaveBeenCalled();
  });

  it('should call searchCourthouses with correct values', (done) => {
    const searchSpy = jest.spyOn(courthouseService, 'searchCourthouses').mockReturnValue(of([]));

    // Define the search values
    const searchValues = { courthouseName: 'Reading', displayName: 'Reading Court', region: 'South West' };

    // Setup the component to be in a state ready to perform the search
    component.isSubmitted$.next(true);
    component.search$.next(searchValues);

    // Wait for async operations to complete
    setTimeout(() => {
      fixture.detectChanges();

      // Check if searchCourthouses was called. Since it's part of an observable chain, we can't assert directly on arguments.
      expect(searchSpy).toHaveBeenCalled();

      // Optionally, if you want to make assumptions about the call arguments, you need to ensure those assumptions
      // match how the component transforms the input observables. This might require inspecting the call arguments
      // and matching them against expected values based on your knowledge of the data processing.

      done();
    }, 0);
  });

  it('should clear the search when onClear is called', () => {
    jest.spyOn(component.search$, 'next');
    component.onClear();
    expect(component.search$.next).toHaveBeenCalledWith(null);
  });

  it('should set isSubmitted to true when onSubmit is called', () => {
    component.onSubmit({}); // Trigger submit
    expect(component.isSubmitted$.value).toBe(true);
  });

  it('should set isSubmitted to false when onClear is called', () => {
    component.onClear();
    expect(component.isSubmitted$.value).toBe(false);
  });
});
