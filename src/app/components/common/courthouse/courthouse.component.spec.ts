import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CourthouseData } from 'src/app/types/courthouse';

import { CourthouseComponent } from './courthouse.component';
import { CaseService } from 'src/app/services/case/case.service';
import { AppInsightsService } from 'src/app/services/app-insights/app-insights.service';
import { of, throwError } from 'rxjs';

describe('CourthouseComponent', () => {
  let component: CourthouseComponent;
  let fixture: ComponentFixture<CourthouseComponent>;

  const courts = [
    { courthouse_name: 'Reading', id: 0, created_date_time: 'mock' },
    { courthouse_name: 'Slough', id: 1, created_date_time: 'mock' },
    { courthouse_name: 'Ascot', id: 2, created_date_time: 'mock' },
  ] as CourthouseData[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourthouseComponent, HttpClientModule],
    });
    fixture = TestBed.createComponent(CourthouseComponent);
    component = fixture.componentInstance;
    component.courthouses = courts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AccessibleAutocomplete props', () => {
    it('should have correct default properties', () => {
      expect(component.props.id).toBe('courthouse');
      expect(component.props.name).toBe('courthouse');
      expect(component.props.minLength).toBe(1);
    });
  });
});
