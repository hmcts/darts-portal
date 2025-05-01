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

  it('should emit pageChange when onPageChange is called', () => {
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');

    component.onPageChange(3);

    expect(pageChangeSpy).toHaveBeenCalledWith(3);
  });

  it('should emit sortChange when a valid sortBy is passed', () => {
    const sortChangeSpy = jest.spyOn(component.sortChange, 'emit');

    component.onSortChange({ sortBy: 'hearingDate', sortOrder: 'asc' });

    expect(sortChangeSpy).toHaveBeenCalledWith({
      sortBy: 'hearingDate',
      sortOrder: 'asc',
    });
  });

  it('should not emit sortChange when sortBy is invalid', () => {
    const sortChangeSpy = jest.spyOn(component.sortChange, 'emit');

    component.onSortChange({ sortBy: 'invalidProp', sortOrder: 'desc' });

    expect(sortChangeSpy).not.toHaveBeenCalled();
  });

  it('should define correct column structure', () => {
    expect(component.columns).toEqual([
      { name: 'Hearing date', prop: 'hearingDate', sortable: true },
      { name: 'Time', prop: 'timestamp', sortable: true },
      { name: 'Event', prop: 'eventName', sortable: true },
      { name: 'Text', prop: 'text', sortable: false },
    ]);
  });

  it('should emit sortChange for admin-only sortBy props when adminScreen is true', () => {
    const sortChangeSpy = jest.spyOn(component.sortChange, 'emit');
    fixture.componentRef.setInput('adminScreen', true);

    component.onSortChange({ sortBy: 'eventId', sortOrder: 'desc' });

    expect(sortChangeSpy).toHaveBeenCalledWith({
      sortBy: 'eventId',
      sortOrder: 'desc',
    });
  });

  it('should NOT emit sortChange for admin-only sortBy props when adminScreen is false', () => {
    const sortChangeSpy = jest.spyOn(component.sortChange, 'emit');
    fixture.componentRef.setInput('adminScreen', false);

    component.onSortChange({ sortBy: 'eventId', sortOrder: 'asc' });

    expect(sortChangeSpy).not.toHaveBeenCalled();
  });

  it('should define correct admin column structure', () => {
    expect(component.adminColumns).toEqual([
      { name: 'Event ID', prop: 'eventId', sortable: true },
      { name: 'Hearing date', prop: 'hearingDate', sortable: true },
      { name: 'Time', prop: 'timestamp', sortable: true },
      { name: 'Event', prop: 'eventName', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'Text', prop: 'text', sortable: true },
    ]);
  });
});
