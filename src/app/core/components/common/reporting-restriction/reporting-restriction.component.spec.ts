import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingRestrictionComponent } from './reporting-restriction.component';
import { By } from '@angular/platform-browser';

describe('ReportingRestrictionComponent', () => {
  let component: ReportingRestrictionComponent;
  let fixture: ComponentFixture<ReportingRestrictionComponent>;

  const caseRestrictions = [
    {
      hearing_id: 1,
      event_id: 99,
      event_name: 'Some restriction',
      event_text: 'blah',
      event_ts: '2024-01-30T16:30:00.000Z',
    },
    {
      hearing_id: 1,
      event_id: 100,
      event_name: 'Restrictions lifted',
      event_text: 'blah',
      event_ts: '2024-01-30T17:30:00.000Z',
    },
    {
      hearing_id: 2,
      event_id: 101,
      event_name: 'Another restriction',
      event_text: 'blah',
      event_ts: '2024-02-01T09:15:00.000Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReportingRestrictionComponent],
    });
    fixture = TestBed.createComponent(ReportingRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('case level (no hearingId input)', () => {
    it('displays all restrictions', () => {
      component.restrictions = caseRestrictions;
      component.ngOnInit();
      expect(component.displayRestrictions).toEqual(caseRestrictions);
      expect(component.heading).toBe('There are restrictions against this case');
      expect(component.footer).toBe('For full details, check the events for each hearing below.');

      fixture.detectChanges();

      const restrictions = fixture.debugElement.queryAll(By.css('.restriction'));
      expect(restrictions).toHaveLength(caseRestrictions.length);
    });

    it('shows applied date time', () => {
      component.restrictions = caseRestrictions;
      component.ngOnInit();

      fixture.detectChanges();

      const appliedDateTimes = fixture.debugElement.queryAll(By.css('.applied-datetime'));
      expect(appliedDateTimes[0].nativeElement.textContent).toBe('- Applied 30 Jan 2024');
      expect(appliedDateTimes[1].nativeElement.textContent).toBe('- Applied 01 Feb 2024');
    });

    it('handles restrictions lifted', () => {
      const restrictionsLiftedEvent = caseRestrictions[1];
      component.restrictions = [restrictionsLiftedEvent];
      component.ngOnInit();

      fixture.detectChanges();

      const restrictionsLifted = fixture.debugElement.query(By.css('.restrictions-lifted')).nativeElement.textContent;
      expect(restrictionsLifted.trim()).toBe('Restrictions lifted: 30 Jan 2024');
    });
  });

  describe('hearing level (with hearingId input)', () => {
    it('displays restrictions matching the hearing', () => {
      const filteredRestrictions = caseRestrictions.filter((r) => r.hearing_id === 1);
      component.restrictions = caseRestrictions;
      component.hearingId = 1;
      component.ngOnInit();
      expect(component.displayRestrictions).toEqual(filteredRestrictions);
      expect(component.heading).toBe('There are restrictions against this hearing');
      expect(component.footer).toBe('For full details, check the hearing events.');

      fixture.detectChanges();

      const restrictions = fixture.debugElement.queryAll(By.css('.restriction'));
      expect(restrictions).toHaveLength(filteredRestrictions.length);
    });

    it('displays case has restrictions if the hearing does not match', () => {
      component.restrictions = caseRestrictions;
      component.hearingId = 999;
      component.ngOnInit();
      expect(component.displayRestrictions).toEqual([]);
      expect(component.heading).toBe('There are restrictions against this case');
    });

    it('does not show applied date time', () => {
      component.restrictions = caseRestrictions;
      component.hearingId = 1;
      component.ngOnInit();

      fixture.detectChanges();

      const appliedDateTimes = fixture.debugElement.queryAll(By.css('.applied-datetime'));
      expect(appliedDateTimes).toEqual([]);
    });

    it('handles restrictions lifted', () => {
      const restrictionsLiftedEvent = caseRestrictions[1];
      component.restrictions = [restrictionsLiftedEvent];
      component.hearingId = 1;
      component.ngOnInit();

      fixture.detectChanges();

      const restrictionsLifted = fixture.debugElement.query(By.css('.restrictions-lifted')).nativeElement.textContent;
      expect(restrictionsLifted.trim()).toBe('Restrictions lifted');
    });
  });
});
