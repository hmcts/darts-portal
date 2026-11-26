import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Case } from '@portal-types/case/case.type';
import { UserService } from '@services/user/user.service';
import { CaseFileComponent } from './case-file.component';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';
import { LABELS } from '@constants/labels.constant';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';

describe('CaseFileComponent', () => {
  let component: CaseFileComponent;
  let fixture: ComponentFixture<CaseFileComponent>;
  let names: string[];
  const featureFlags = { isEnabled: jest.fn() };

  const mockCaseFile: Case = {
    id: 1,
    courthouse: 'Swansea',
    number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reportingRestrictions: [
      {
        hearing_id: 1,
        event_id: 1,
        event_name: 'Section 4(2) of the Contempt of Court Act 1981',
        event_text: '',
        event_ts: '2023-08-10T09:00:00Z',
      },
    ],
    retainUntil: '2023-08-10T11:23:24.858Z',
  };
  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
    },
  };
  const fakeUserService = { isRequester: () => true, isTranscriber: () => false } as Partial<UserService>;

  beforeEach(() => {
    featureFlags.isEnabled.mockReturnValue(false);
    names = ['Zoe Taylor', 'Alex Brown', 'Morgan Reed'];

    TestBed.configureTestingModule({
      imports: [CaseFileComponent],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FeatureFlagService, useValue: featureFlags },
        DatePipe,
      ],
    });
    fixture = TestBed.createComponent(CaseFileComponent);
    component = fixture.componentInstance;
    component.caseFile = mockCaseFile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Retained Until date display', () => {
    function expectRetainedUntilDate(inputIso: string, expectedDate: string) {
      component.caseFile = {
        ...mockCaseFile,
        retainUntilDateTime: DateTime.fromISO(inputIso),
      };

      fixture.detectChanges();

      const headings = Array.from(fixture.nativeElement.querySelectorAll('h2.govuk-heading-s')) as HTMLElement[];
      const retainedUntilHeading = headings.find((h) => (h.textContent || '').trim() === 'Retained until');
      expect(retainedUntilHeading).toBeTruthy();

      const retainedUntilP = retainedUntilHeading!.nextElementSibling as HTMLElement | null;
      expect(retainedUntilP).toBeTruthy();

      const retainedText = retainedUntilP!.textContent?.trim() ?? '';
      expect(retainedText).toContain(expectedDate);
    }

    it('should display winter date correctly, i.e. +00:00', () => {
      expectRetainedUntilDate('2030-02-10T23:23:24.858Z', '10 Feb 2030');
    });

    it('should display summer BST date correctly, i.e. +01:00', () => {
      expectRetainedUntilDate('2030-08-10T23:23:24.858Z', '11 Aug 2030');
    });
  });

  describe('Judges and magistrates label and content', () => {
    function getDisplayedNamesValue(): HTMLElement {
      return fixture.debugElement.query(By.css('app-see-more-list .govuk-body')).nativeElement;
    }

    function getDisplayedNamesAndBreaks(): string[] {
      return Array.from(getDisplayedNamesValue().childNodes)
        .filter((node) => node.nodeName === 'BR' || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))
        .map((node) => (node.nodeName === 'BR' ? '<br>' : (node.textContent ?? '').trim()));
    }

    it.each([
      { flagState: false, expectedLabel: 'Judge(s)' },
      { flagState: true, expectedLabel: LABELS.judgesAndMagistrates },
    ])(
      'should display "$expectedLabel" when the updated-judge-label flag is $flagState',
      ({ flagState, expectedLabel }) => {
        featureFlags.isEnabled.mockReturnValue(flagState);

        fixture.detectChanges();

        const heading = fixture.debugElement.query(By.css('.judges-heading h2'));

        expect(heading.nativeElement.textContent.trim()).toBe(expectedLabel);
      }
    );

    it.each([
      { flagState: true, judges: undefined, description: 'undefined' },
      { flagState: true, judges: [], description: 'an empty list' },
      { flagState: false, judges: undefined, description: 'undefined' },
      { flagState: false, judges: [], description: 'an empty list' },
    ])(
      'should display "-" when names are $description and the updated-judge-label flag is $flagState',
      ({ flagState, judges }) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges };

        fixture.detectChanges();

        expect(getDisplayedNamesValue().textContent?.trim()).toBe('-');
      }
    );

    it.each([false, true])(
      'should display a single name on one line when the updated-judge-label flag is %s',
      (flagState) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges: ['Zoe Taylor'] };

        fixture.detectChanges();

        expect(getDisplayedNamesAndBreaks()).toEqual(['Zoe Taylor', '<br>']);
      }
    );

    it.each([
      {
        flagState: false,
        nameOrder: 'supplied',
        expectedNamesAndBreaks: ['Zoe Taylor', '<br>', 'Alex Brown', '<br>'],
      },
      {
        flagState: true,
        nameOrder: 'alphabetical',
        expectedNamesAndBreaks: ['Alex Brown', '<br>', 'Zoe Taylor', '<br>'],
      },
    ])(
      'should display two names in $nameOrder order on separate lines when the updated-judge-label flag is $flagState',
      ({ flagState, expectedNamesAndBreaks }) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges: ['Zoe Taylor', 'Alex Brown'] };

        fixture.detectChanges();

        expect(getDisplayedNamesAndBreaks()).toEqual(expectedNamesAndBreaks);
      }
    );

    it.each([
      { flagState: false, nameCount: 1, judges: ['Zoe Taylor'] },
      { flagState: false, nameCount: 2, judges: ['Zoe Taylor', 'Alex Brown'] },
      { flagState: true, nameCount: 1, judges: ['Zoe Taylor'] },
      { flagState: true, nameCount: 2, judges: ['Zoe Taylor', 'Alex Brown'] },
    ])(
      'should not display "See more" when $nameCount name(s) are supplied and the updated-judge-label flag is $flagState',
      ({ flagState, judges }) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges };

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.judges-heading details summary'))).toBeNull();
      }
    );

    it.each([
      { flagState: false, nameOrder: 'supplied', expectedNamesAndBreaks: ['Zoe Taylor', '<br>', 'Alex Brown', '<br>'] },
      {
        flagState: true,
        nameOrder: 'alphabetical',
        expectedNamesAndBreaks: ['Alex Brown', '<br>', 'Morgan Reed', '<br>'],
      },
    ])(
      'should render only the first two names in $nameOrder order when three names are supplied and the updated-judge-label flag is $flagState',
      ({ flagState, expectedNamesAndBreaks }) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges: names };

        fixture.detectChanges();

        expect(getDisplayedNamesAndBreaks()).toEqual(expectedNamesAndBreaks);
      }
    );

    it.each([false, true])(
      'should display "See more" when three names are supplied and the updated-judge-label flag is %s',
      (flagState) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges: names };

        fixture.detectChanges();

        const summary = fixture.debugElement.query(By.css('.judges-heading details summary'));

        expect(summary.nativeElement.textContent.trim()).toBe('See more');
      }
    );

    it.each([
      {
        flagState: false,
        nameOrder: 'supplied',
        expectedNamesAndBreaks: ['Zoe Taylor', '<br>', 'Alex Brown', '<br>', 'Morgan Reed', '<br>'],
      },
      {
        flagState: true,
        nameOrder: 'alphabetical',
        expectedNamesAndBreaks: ['Alex Brown', '<br>', 'Morgan Reed', '<br>', 'Zoe Taylor', '<br>'],
      },
    ])(
      'should render all three names in $nameOrder order when expanded and the updated-judge-label flag is $flagState',
      ({ flagState, expectedNamesAndBreaks }) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges: names };
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.judges-heading details')).nativeElement.dispatchEvent(new Event('toggle'));
        fixture.detectChanges();

        expect(getDisplayedNamesAndBreaks()).toEqual(expectedNamesAndBreaks);
      }
    );

    it.each([false, true])(
      'should display "See less" when three names are expanded and the updated-judge-label flag is %s',
      (flagState) => {
        featureFlags.isEnabled.mockReturnValue(flagState);
        component.caseFile = { ...mockCaseFile, judges: names };
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.judges-heading details')).nativeElement.dispatchEvent(new Event('toggle'));
        fixture.detectChanges();

        const summary = fixture.debugElement.query(By.css('.judges-heading details summary'));

        expect(summary.nativeElement.textContent.trim()).toBe('See less');
      }
    );

    it('should preserve the supplied names when the updated-judge-label flag is enabled', () => {
      const originalNames = [...names];
      featureFlags.isEnabled.mockReturnValue(true);
      component.caseFile = { ...mockCaseFile, judges: names };

      fixture.detectChanges();

      expect(names).toEqual(originalNames);
    });

    it('should display the new case names alphabetically when changing to another case and the updated-judge-label flag is enabled', () => {
      featureFlags.isEnabled.mockReturnValue(true);
      component.caseFile = { ...mockCaseFile, judges: names };
      fixture.detectChanges();

      component.caseFile = { ...mockCaseFile, id: 2, judges: ['Priya Shah', 'Ben Lewis'] };
      fixture.detectChanges();

      expect(getDisplayedNamesAndBreaks()).toEqual(['Ben Lewis', '<br>', 'Priya Shah', '<br>']);
    });
  });
});
