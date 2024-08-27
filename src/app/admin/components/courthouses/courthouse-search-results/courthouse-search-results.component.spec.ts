import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CourthouseSearchResultsComponent } from './courthouse-search-results.component';

describe('CourthouseSearchResultsComponent', () => {
  let component: CourthouseSearchResultsComponent;
  let fixture: ComponentFixture<CourthouseSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthouseSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rows', () => {
    it('maps results', () => {
      const courthouse = { courthouseName: 'name', displayName: 'display', region: { name: 'Wales' } } as Courthouse;
      fixture.componentRef.setInput('results', [courthouse]);
      fixture.detectChanges();
      expect(component.rows()).toEqual([{ ...courthouse, regionName: 'Wales' }]);
    });
  });

  describe('computed caption', () => {
    it('singular', () => {
      fixture.componentRef.setInput('results', [{}]);
      fixture.detectChanges();
      expect(component.caption()).toEqual('1 result');
    });

    it('plural', () => {
      fixture.componentRef.setInput('results', [{}, {}]);
      fixture.detectChanges();
      expect(component.caption()).toEqual('2 results');
    });
  });
});
