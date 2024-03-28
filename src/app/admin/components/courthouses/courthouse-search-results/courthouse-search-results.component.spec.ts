import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthouseSearchResultsComponent } from './courthouse-search-results.component';
import { DateTime } from 'luxon';

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

  it('should generate result(s) string', () => {
    const courthouses = [
      {
        courthouseName: 'name',
        displayName: 'NAME',
        code: 1,
        id: 1,
        createdDateTime: DateTime.now(),
        lastModifiedDateTime: DateTime.now(),
      },
      {
        courthouseName: 'name',
        displayName: 'NAME',
        code: 1,
        id: 1,
        createdDateTime: DateTime.now(),
        lastModifiedDateTime: DateTime.now(),
      },
    ];
    component.results = courthouses;
    expect(component.caption).toEqual('2 results');
    // Just extract the first item in the array above
    component.results = [courthouses[0]];
    expect(component.caption).toEqual('1 result');
  });
});
