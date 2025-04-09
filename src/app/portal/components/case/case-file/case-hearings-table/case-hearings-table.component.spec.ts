import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { CaseHearingsTableComponent } from './case-hearings-table.component';

describe('CaseHearingsTableComponent', () => {
  let component: CaseHearingsTableComponent;
  let fixture: ComponentFixture<CaseHearingsTableComponent>;
  let routerSpy: jest.Mocked<Router>;
  let activeTabServiceSpy: jest.Mocked<ActiveTabService>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    activeTabServiceSpy = {
      clearActiveTab: jest.fn(),
    } as unknown as jest.Mocked<ActiveTabService>;

    await TestBed.configureTestingModule({
      imports: [CaseHearingsTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActiveTabService, useValue: activeTabServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseHearingsTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goToHearingDetails', () => {
    it('should navigate to admin path and clear admin tab when adminScreen is true', () => {
      fixture.componentRef.setInput('caseId', 123);
      fixture.componentRef.setInput('adminScreen', true);

      fixture.detectChanges();

      component.goToHearingDetails(456);

      expect(activeTabServiceSpy.clearActiveTab).toHaveBeenCalledWith('admin-hearing-details');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/case', 123, 'hearing', 456], {
        queryParams: { backUrl: '/admin/case/123' },
      });
    });

    it('should navigate to user path and clear user tab when adminScreen is false', () => {
      fixture.componentRef.setInput('caseId', 789);
      fixture.componentRef.setInput('adminScreen', false);

      fixture.detectChanges();

      component.goToHearingDetails(987);

      expect(activeTabServiceSpy.clearActiveTab).toHaveBeenCalledWith('hearing-screen');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/case', 789, 'hearing', 987], {
        queryParams: { backUrl: '/case/789' },
      });
    });
  });
});
