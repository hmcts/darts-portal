import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DateTime } from 'luxon';
import { AssociatedHearingsTableComponent } from './associated-hearings-table.component';

describe('AssociatedHearingsTableComponent', () => {
  let component: AssociatedHearingsTableComponent;
  let fixture: ComponentFixture<AssociatedHearingsTableComponent>;

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

  const backUrl = '/admin/audio-file/1';
  const getLinks = (): HTMLAnchorElement[] => Array.from(fixture.nativeElement.querySelectorAll('tbody a'));
  const getRows = (): HTMLTableRowElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr.govuk-table__row'));
  const getExpiredRows = (): HTMLTableRowElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody tr.expired-row'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedHearingsTableComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociatedHearingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a non-anonymised hearing date as a link to the hearing with backUrl query param', () => {
    fixture.componentRef.setInput('rows', hearing);
    fixture.componentRef.setInput('url', backUrl);
    fixture.detectChanges();

    const links = getLinks();

    expect(links).toHaveLength(2);
    expect(links[0].textContent?.trim()).toBe('123');
    expect(links[0].getAttribute('href')).toBe('/admin/case/12?backUrl=%2Fadmin%2Faudio-file%2F1');
    expect(links[1].textContent?.trim()).toBe('01 Oct 2023');
    expect(links[1].getAttribute('href')).toBe('/admin/case/12/hearing/13?backUrl=%2Fadmin%2Faudio-file%2F1');
    expect(getExpiredRows()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).not.toContain('This case has passed its retention date');
  });

  it('should render an anonymised hearing date as text with an expired case message', () => {
    fixture.componentRef.setInput('rows', hearing_exp);
    fixture.componentRef.setInput('url', backUrl);
    fixture.detectChanges();

    const links = getLinks();
    const expiredRows = getExpiredRows();

    expect(links).toHaveLength(1);
    expect(links[0].textContent?.trim()).toBe('456');
    expect(links[0].getAttribute('href')).toBe('/admin/case/45?backUrl=%2Fadmin%2Faudio-file%2F1');
    expect(fixture.nativeElement.textContent).toContain('02 Oct 2023');
    expect(fixture.nativeElement.querySelector('a[href*="/admin/case/45/hearing/46"]')).toBeNull();
    expect(expiredRows).toHaveLength(1);
    expect(expiredRows[0].querySelector('td')?.getAttribute('colspan')).toBe('4');
    expect(expiredRows[0].textContent).toContain('Expired:');
    expect(expiredRows[0].textContent).toContain('This case has passed its retention date');
    expect(expiredRows[0].querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Case has expired');
  });

  it('should have just 1 row in the table for a single hearing', () => {
    fixture.componentRef.setInput('rows', hearing);
    fixture.detectChanges();
    expect(getRows()).toHaveLength(1);
    expect(getExpiredRows()).toHaveLength(0);
  });

  it('should have 2 rows in the table for a single hearing on an expired case', () => {
    fixture.componentRef.setInput('rows', hearing_exp);
    fixture.detectChanges();
    expect(getRows()).toHaveLength(2);
    expect(getExpiredRows()).toHaveLength(1);
  });

  it('should have 2 rows in the table for 2 hearings', () => {
    fixture.componentRef.setInput('rows', [...hearing, ...hearing]);
    fixture.detectChanges();
    expect(getRows()).toHaveLength(2);
    expect(getExpiredRows()).toHaveLength(0);
  });

  it('should have 3 rows in the table for 2 hearings (one on an expired case)', () => {
    fixture.componentRef.setInput('rows', [...hearing_exp, ...hearing]);
    fixture.detectChanges();
    expect(getRows()).toHaveLength(3);
    expect(getExpiredRows()).toHaveLength(1);
  });

  it('should have 4 rows in the table for 2 hearings (both on expired cases)', () => {
    fixture.componentRef.setInput('rows', [...hearing_exp, ...hearing_exp]);
    fixture.detectChanges();
    expect(getRows()).toHaveLength(4);
    expect(getExpiredRows()).toHaveLength(2);
  });

  it('should only render expired rows for anonymised hearings when results are mixed', () => {
    fixture.componentRef.setInput('rows', [...hearing, ...hearing_exp]);
    fixture.detectChanges();

    expect(getRows()).toHaveLength(3);
    expect(getExpiredRows()).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('a[href*="/admin/case/12/hearing/13"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href*="/admin/case/45/hearing/46"]')).toBeNull();
  });
});
