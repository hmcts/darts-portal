import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchResultsComponent } from './user-search-results.component';
import { DateTime } from 'luxon';

describe('UserSearchResultsComponent', () => {
  let component: UserSearchResultsComponent;
  let fixture: ComponentFixture<UserSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate result(s) string', () => {
    const users = [
      {
        id: 1,
        lastLoginAt: DateTime.now(),
        lastModifiedAt: DateTime.now(),
        createdAt: DateTime.now(),
        fullName: 'name',
        emailAddress: 'email@address.com',
        description: 'description',
        active: true,
        securityGroupIds: [],
      },
      {
        id: 1,
        lastLoginAt: DateTime.now(),
        lastModifiedAt: DateTime.now(),
        createdAt: DateTime.now(),
        fullName: 'name',
        emailAddress: 'email@address.com',
        description: 'description',
        active: true,
        securityGroupIds: [],
      },
    ];
    component.results = users;
    expect(component.caption).toEqual('2 results');
    // Just extract the first item in the array above
    component.results = [users[0]];
    expect(component.caption).toEqual('1 result');
  });
});
