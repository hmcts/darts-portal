import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseSearchResult } from '@portal-types/index';
import { CaseSearchResultsComponent } from './case-search-results.component';
import { provideRouter } from '@angular/router';

describe('ResultsComponent', () => {
  let component: CaseSearchResultsComponent;
  let fixture: ComponentFixture<CaseSearchResultsComponent>;

  const mockCases: CaseSearchResult[] = [
    {
      id: 24,
      number: 'C20220622024',
      courthouse: 'Reading',
      courtrooms: ['24'],
      judges: ['Judge Judy'],
      defendants: ['Defendant Dennis'],
      linkedCases: [
        {
          case_id: 21,
          case_number: 'C20220622021',
          active_link: true,
        },
        {
          case_id: 22,
          case_number: 'C20220622022',
          active_link: false,
        },
        {
          case_id: 23,
          case_number: 'C20220622023',
          active_link: true,
        },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseSearchResultsComponent],
      providers: [DatePipe, provideRouter([])],
    });
    fixture = TestBed.createComponent(CaseSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set caption correctly for adminPortal', () => {
    component.adminPortal = true;
    component.cases = [{ number: '123' } as CaseSearchResult];
    component.ngOnChanges();
    expect(component.caption).toBe('case result');

    component.cases = [{ number: '123' } as CaseSearchResult, { number: '456' } as CaseSearchResult];
    component.ngOnChanges();
    expect(component.caption).toBe('case results');
  });

  it('should set caption correctly for non-adminPortal', () => {
    component.adminPortal = false;
    component.cases = [{ number: '123' } as CaseSearchResult];
    component.ngOnChanges();
    expect(component.caption).toBe('1 result');

    component.cases = [{ number: '123' } as CaseSearchResult, { number: '456' } as CaseSearchResult];
    component.ngOnChanges();
    expect(component.caption).toBe('2 results');
  });

  describe('Linked cases', () => {
    function getLinkedCasesCell(): HTMLElement {
      const cell = fixture.nativeElement.querySelector(
        'tbody tr.govuk-table__row td.linked_cases'
      ) as HTMLElement | null;

      expect(cell).toBeTruthy();
      return cell!;
    }

    function setCases(cases: CaseSearchResult[]): void {
      component.cases = cases;
      component.ngOnChanges();
      fixture.detectChanges();
    }

    it('should display all linked case numbers', () => {
      setCases(mockCases);

      const items = getLinkedCasesCell().querySelectorAll('li');

      expect(items.length).toBe(3);
      expect(items[0].textContent?.trim()).toBe('C20220622021');
      expect(items[1].textContent?.trim()).toBe('C20220622022');
      expect(items[2].textContent?.trim()).toBe('C20220622023');
    });

    it('should display active linked cases as hyperlinks', () => {
      setCases(mockCases);

      const links = getLinkedCasesCell().querySelectorAll('a.govuk-link');

      expect(links.length).toBe(2);

      expect(links[0].textContent?.trim()).toBe('C20220622021');
      expect(links[0].getAttribute('href')).toBe('/case/21');

      expect(links[1].textContent?.trim()).toBe('C20220622023');
      expect(links[1].getAttribute('href')).toBe('/case/23');
    });

    it('should display inactive linked cases as plain text', () => {
      setCases(mockCases);

      const items = getLinkedCasesCell().querySelectorAll('li');

      expect(items[1].textContent?.trim()).toBe('C20220622022');
      expect(items[1].querySelector('a')).toBeNull();
    });

    it('should display a hyphen when there are no linked cases', () => {
      setCases([
        {
          ...mockCases[0],
          linkedCases: [],
        },
      ]);

      expect(getLinkedCasesCell().textContent?.trim()).toBe('-');
    });

    it('should display a hyphen when linked cases are undefined', () => {
      setCases([
        {
          ...mockCases[0],
          linkedCases: undefined,
        },
      ]);

      expect(getLinkedCasesCell().textContent?.trim()).toBe('-');
    });

    it('should use admin case URLs when adminPortal is true', () => {
      component.adminPortal = true;
      setCases(mockCases);

      const links = getLinkedCasesCell().querySelectorAll('a.govuk-link');

      expect(links.length).toBe(2);
      expect(links[0].getAttribute('href')).toBe('/admin/case/21');
      expect(links[1].getAttribute('href')).toBe('/admin/case/23');
    });
  });
});
