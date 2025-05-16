import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseSearchResult } from '@portal-types/index';
import { CaseSearchResultsComponent } from './case-search-results.component';

describe('ResultsComponent', () => {
  let component: CaseSearchResultsComponent;
  let fixture: ComponentFixture<CaseSearchResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseSearchResultsComponent],
      providers: [DatePipe],
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

  describe('clearStoredTabs', () => {
    it('should call clearActiveTab with "admin-case-details" when adminPortal is true', () => {
      const clearSpy = jest.spyOn(component.activeTabService, 'clearActiveTab');
      component.adminPortal = true;

      component.clearStoredTabs();

      expect(clearSpy).toHaveBeenCalledWith('admin-case-details');
    });

    it('should call clearActiveTab with "case" when adminPortal is false', () => {
      const clearSpy = jest.spyOn(component.activeTabService, 'clearActiveTab');
      component.adminPortal = false;

      component.clearStoredTabs();

      expect(clearSpy).toHaveBeenCalledWith('case');
    });
  });
});
