import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSearchResultsComponent } from './event-search-results.component';

describe('EventSearchResultsComponent', () => {
  let component: EventSearchResultsComponent;
  let fixture: ComponentFixture<EventSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
