import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LABELS } from '@constants/labels.constant';
import { Hearing } from '@portal-types/hearing/hearing.type';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';
import { DateTime } from 'luxon';
import { CaseHearingsTableComponent } from './case-hearings-table.component';

describe('CaseHearingsTableComponent', () => {
  let fixture: ComponentFixture<CaseHearingsTableComponent>;
  let hearing: Hearing;
  const featureFlags = { isEnabled: jest.fn() };

  function getColumnHeading(label: string): HTMLTableCellElement {
    return fixture.nativeElement.querySelector(`th[aria-label="${label} column header"]`);
  }

  function getColumnCells(label: string): HTMLTableCellElement[] {
    const heading = getColumnHeading(label);
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;

    return Array.from(rows, (row) => row.cells[heading.cellIndex]);
  }

  beforeEach(async () => {
    featureFlags.isEnabled.mockReturnValue(false);
    hearing = {
      id: 1,
      date: DateTime.fromISO('2026-11-10'),
      courtroom: '1',
      judges: ['Zoe Taylor', 'Alex Brown', 'Morgan Reed'],
      transcriptCount: 0,
    };

    await TestBed.configureTestingModule({
      imports: [CaseHearingsTableComponent],
      providers: [DatePipe, provideRouter([]), { provide: FeatureFlagService, useValue: featureFlags }],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseHearingsTableComponent);
    fixture.componentRef.setInput('caseId', 1);
    fixture.componentRef.setInput('hearings', [hearing]);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  const portalAndFlagScenarios = [
    { adminScreen: true, enabled: true, expectedLabel: LABELS.judgesAndMagistrates },
    { adminScreen: true, enabled: false, expectedLabel: 'Judge' },
    { adminScreen: false, enabled: true, expectedLabel: 'Judge' },
    { adminScreen: false, enabled: false, expectedLabel: 'Judge' },
  ];

  describe('Column headings', () => {
    it.each(portalAndFlagScenarios)(
      'should display "$expectedLabel" as the column heading when admin=$adminScreen and the updated-judge-label flag is $enabled',
      ({ adminScreen, enabled, expectedLabel }) => {
        featureFlags.isEnabled.mockReturnValue(enabled);
        fixture.componentRef.setInput('adminScreen', adminScreen);

        fixture.detectChanges();

        const heading = getColumnHeading(expectedLabel);

        expect(heading.textContent.trim()).toBe(expectedLabel);
      }
    );

    it.each(portalAndFlagScenarios)(
      'should use "$expectedLabel" in the sort button\'s accessible label when admin=$adminScreen and the updated-judge-label flag is $enabled',
      ({ adminScreen, enabled, expectedLabel }) => {
        featureFlags.isEnabled.mockReturnValue(enabled);
        fixture.componentRef.setInput('adminScreen', adminScreen);

        fixture.detectChanges();

        const heading = getColumnHeading(expectedLabel);

        expect(heading.querySelector('button')?.getAttribute('aria-label')).toBe(
          'Sortable column for ' + expectedLabel
        );
      }
    );
  });

  describe('Names and formatting', () => {
    it('should display hearing names alphabetically with spaces and commas when the updated-judge-label flag is enabled on Admin', () => {
      featureFlags.isEnabled.mockReturnValue(true);
      fixture.componentRef.setInput('adminScreen', true);

      fixture.detectChanges();

      expect(getColumnCells(LABELS.judgesAndMagistrates)[0].textContent?.trim()).toBe(
        'Alex Brown, Morgan Reed, Zoe Taylor'
      );
    });

    it('should preserve the original names when displaying them alphabetically on Admin', () => {
      const originalNames = [...hearing.judges];
      featureFlags.isEnabled.mockReturnValue(true);
      fixture.componentRef.setInput('adminScreen', true);

      fixture.detectChanges();

      expect(hearing.judges).toEqual(originalNames);
    });

    it.each([
      [true, false],
      [false, true],
      [false, false],
    ])(
      'should preserve the supplied name order and comma-only separators when admin=%s and the updated-judge-label flag is %s',
      (adminScreen, enabled) => {
        featureFlags.isEnabled.mockReturnValue(enabled);
        fixture.componentRef.setInput('adminScreen', adminScreen);

        fixture.detectChanges();

        expect(getColumnCells('Judge')[0].textContent?.trim()).toBe('Zoe Taylor,Alex Brown,Morgan Reed');
      }
    );

    it.each(portalAndFlagScenarios)(
      'should display a blank judge value when no names exist, admin=$adminScreen and the updated-judge-label flag is $enabled',
      ({ adminScreen, enabled, expectedLabel }) => {
        featureFlags.isEnabled.mockReturnValue(enabled);
        fixture.componentRef.setInput('adminScreen', adminScreen);
        fixture.componentRef.setInput('hearings', [{ ...hearing, judges: [] }]);

        fixture.detectChanges();

        expect(getColumnCells(expectedLabel)[0].textContent?.trim()).toBe('');
      }
    );

    it("should display each hearing's own names alphabetically with spaces and commas when the updated-judge-label flag is enabled on Admin", () => {
      featureFlags.isEnabled.mockReturnValue(true);
      fixture.componentRef.setInput('adminScreen', true);
      fixture.componentRef.setInput('hearings', [
        hearing,
        {
          ...hearing,
          id: 2,
          date: DateTime.fromISO('2026-11-11'),
          judges: ['Priya Shah', 'Ben Lewis'],
        },
      ]);

      fixture.detectChanges();

      const judgeCells = getColumnCells(LABELS.judgesAndMagistrates);

      expect(judgeCells[0].textContent?.trim()).toBe('Alex Brown, Morgan Reed, Zoe Taylor');
      expect(judgeCells[1].textContent?.trim()).toBe('Ben Lewis, Priya Shah');
    });
  });

  // Tests can be removed once the updated-judge-label flag is removed.
  describe('Case navigation', () => {
    it.each([
      { initial: false, next: true, oldLabel: 'Judge', newLabel: LABELS.judgesAndMagistrates },
      { initial: true, next: false, oldLabel: LABELS.judgesAndMagistrates, newLabel: 'Judge' },
    ])(
      'should display "$newLabel" as the column heading and use it in the accessible sort label when switching cases on Admin and the updated-judge-label flag changes from $initial to $next',
      ({ initial, next, oldLabel, newLabel }) => {
        featureFlags.isEnabled.mockReturnValue(initial);
        fixture.componentRef.setInput('adminScreen', true);

        fixture.detectChanges();

        expect(getColumnHeading(oldLabel).textContent?.trim()).toBe(oldLabel);

        featureFlags.isEnabled.mockReturnValue(next);
        fixture.componentRef.setInput('caseId', 2);
        fixture.detectChanges();

        const heading = getColumnHeading(newLabel);

        expect(heading.textContent.trim()).toBe(newLabel);
        expect(heading.querySelector('button')?.getAttribute('aria-label')).toBe('Sortable column for ' + newLabel);
      }
    );

    it('should refresh name ordering and spacing when switching cases on Admin and the updated-judge-label flag snapshot changes', () => {
      fixture.componentRef.setInput('adminScreen', true);

      fixture.detectChanges();

      featureFlags.isEnabled.mockReturnValue(true);
      fixture.componentRef.setInput('caseId', 2);
      fixture.detectChanges();

      expect(getColumnCells(LABELS.judgesAndMagistrates)[0].textContent?.trim()).toBe(
        'Alex Brown, Morgan Reed, Zoe Taylor'
      );

      featureFlags.isEnabled.mockReturnValue(false);
      fixture.componentRef.setInput('caseId', 3);
      fixture.detectChanges();

      expect(getColumnCells('Judge')[0].textContent?.trim()).toBe('Zoe Taylor,Alex Brown,Morgan Reed');
    });
  });
});
