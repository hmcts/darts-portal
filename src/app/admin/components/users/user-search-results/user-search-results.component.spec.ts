import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchResultsComponent } from './user-search-results.component';

describe('UserSearchResultsComponent', () => {
  let component: UserSearchResultsComponent;
  let fixture: ComponentFixture<UserSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
