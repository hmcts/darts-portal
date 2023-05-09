import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppInsightsService } from 'src/app/services/app-insights/app-insights.service';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let appInsightsServiceSpy: jasmine.SpyObj<AppInsightsService>;

  beforeEach(async () => {
    appInsightsServiceSpy = jasmine.createSpyObj('AppInsightsService', ['logEvent']);

    await TestBed.configureTestingModule({
      imports: [MatIconModule, ReactiveFormsModule],
      declarations: [SearchComponent],
      providers: [{ provide: AppInsightsService, useValue: appInsightsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with empty search term', () => {
    expect(component).toBeTruthy();
    expect(component.searchTerm.value).toEqual('');
  });

  it('does search and clear the value', () => {
    component.searchTerm.setValue('CASE1001');
    component.search();
    expect(component.searchTerm.value).toEqual('');
  });

  it('logs app insights event on search', () => {
    component.searchTerm.setValue('CASE1001');
    component.search();

    expect(appInsightsServiceSpy.logEvent.calls.count()).withContext('spy method was called once').toBe(1);
    expect(appInsightsServiceSpy.logEvent.calls.first().args).toEqual(['CASE_SEARCH', { searchTerm: 'CASE1001' }]);
  });
});
