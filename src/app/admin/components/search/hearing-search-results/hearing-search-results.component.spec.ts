import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { DateTime } from 'luxon';
import { HearingSearchResultsComponent } from './hearing-search-results.component';

describe('HearingSearchResultsComponent', () => {
  let component: HearingSearchResultsComponent;
  let fixture: ComponentFixture<HearingSearchResultsComponent>;

  const hearing = [
    {
      caseId: 12,
      caseNumber: '123',
      hearingId: 13,
      hearingDate: DateTime.fromISO('2023-10-01'),
      courthouse: 'Courthouse A',
      courtroom: 'Room 1',
      isHearingAnonymised: false,
    },
  ];
  const hearing_exp = [
    {
      caseId: 45,
      caseNumber: '456',
      hearingId: 46,
      hearingDate: DateTime.fromISO('2023-10-02'),
      courthouse: 'Courthouse B',
      courtroom: 'Room 2',
      isHearingAnonymised: true,
    },
  ];

  const getLinks = (): HTMLAnchorElement[] => Array.from(fixture.nativeElement.querySelectorAll('tbody a'));
  const getRows = (): HTMLTableRowElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr.govuk-table__row'));
  const getExpiredRows = (): HTMLTableRowElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr.expired-row'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingSearchResultsComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have singular caption for a single hearing, with just 1 row in the table', () => {
    fixture.componentRef.setInput('hearings', hearing);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing result');
    expect(getRows()).toHaveLength(1);
    expect(getExpiredRows()).toHaveLength(0);
  });

  it('should have singular caption for a single hearing on an expired case, with 2 rows in the table', () => {
    fixture.componentRef.setInput('hearings', hearing_exp);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing result');
    expect(getRows()).toHaveLength(2);
    expect(getExpiredRows()).toHaveLength(1);
  });

  it('should have plural caption for 2 hearings, with 2 rows in the table', () => {
    fixture.componentRef.setInput('hearings', [...hearing, ...hearing]);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing results');
    expect(getRows()).toHaveLength(2);
    expect(getExpiredRows()).toHaveLength(0);
  });

  it('should have plural caption for 2 hearings (one on an expired case), with 3 rows in the table', () => {
    fixture.componentRef.setInput('hearings', [...hearing_exp, ...hearing]);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing results');
    expect(getRows()).toHaveLength(3);
    expect(getExpiredRows()).toHaveLength(1);
  });

  it('should have plural caption for 2 hearings (both on expired cases), with 4 rows in the table', () => {
    fixture.componentRef.setInput('hearings', [...hearing_exp, ...hearing_exp]);
    fixture.detectChanges();
    expect(component.caption()).toBe('hearing results');
    expect(getRows()).toHaveLength(4);
    expect(getExpiredRows()).toHaveLength(2);
  });

  it('should render a hearing date for a non-anonymised case as a link to the hearing', () => {
    fixture.componentRef.setInput('hearings', hearing);
    fixture.detectChanges();

    const links = getLinks();

    expect(links).toHaveLength(2);
    expect(links[0].textContent?.trim()).toBe('123');
    expect(links[0].getAttribute('href')).toBe('/admin/case/12');
    expect(links[1].textContent?.trim()).toBe('01/10/2023');
    expect(links[1].getAttribute('href')).toBe('/admin/case/12/hearing/13');
    expect(getExpiredRows()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).not.toContain('This case has passed its retention date');
  });

  it('should render a hearing date for an anonymised case as plain text with an expired case message row afterwards', () => {
    fixture.componentRef.setInput('hearings', hearing_exp);
    fixture.detectChanges();

    const links = getLinks();
    const expiredRows = getExpiredRows();

    expect(links).toHaveLength(1);
    expect(links[0].textContent?.trim()).toBe('456');
    expect(links[0].getAttribute('href')).toBe('/admin/case/45');
    expect(fixture.nativeElement.textContent).toContain('02/10/2023');
    expect(fixture.nativeElement.querySelector('a[href="/admin/case/45/hearing/46"]')).toBeNull();
    expect(expiredRows).toHaveLength(1);
    expect(expiredRows[0].querySelector('td')?.getAttribute('colspan')).toBe('4');
    expect(expiredRows[0].textContent).toContain('Expired:');
    expect(expiredRows[0].textContent).toContain('This case has passed its retention date');
    expect(expiredRows[0].querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Case has expired');
  });

  it('should only render expired rows for anonymised hearings when results are mixed', () => {
    fixture.componentRef.setInput('hearings', [...hearing, ...hearing_exp]);
    fixture.detectChanges();

    expect(getRows()).toHaveLength(3);
    expect(getExpiredRows()).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('a[href="/admin/case/12/hearing/13"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/admin/case/45/hearing/46"]')).toBeNull();
  });
});
