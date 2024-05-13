import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from '@common/filters/filter.interface';
import { CourthouseUsersComponent } from './courthouse-users.component';

describe('CourthouseUsersComponent', () => {
  let component: CourthouseUsersComponent;
  let fixture: ComponentFixture<CourthouseUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthouseUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseUsersComponent);
    component = fixture.componentInstance;

    component.users = [
      {
        userName: 'Eric Bristow',
        email: 'eric.bristow@darts.local',
        roleType: 'Approver',
        userId: 1,
        groupId: 12,
      },
      {
        userName: 'Michael van Gerwen',
        email: 'michael.vangerwen@darts.local',
        roleType: 'Approver',
        userId: 3,
        groupId: 12,
      },
      {
        userName: 'Fallon Sherrock',
        email: 'fallon.sherrock@darts.local',
        roleType: 'Requestor',
        userId: 2,
        groupId: 13,
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setFilters', () => {
    it('should filter table based on selected filters', () => {
      const criteria: Filter[] = [
        {
          displayName: 'User Name',
          name: 'userName',
          values: ['Eric Bristow'],
          multiselect: true,
        },
        {
          displayName: 'Role Type',
          name: 'roleType',
          values: ['Approver'],
          multiselect: true,
        },
      ];

      const expectedUsers = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          userId: 1,
          groupId: 12,
        },
      ];

      component.setFilters(criteria);
      expect(component.users).toEqual(expectedUsers);
    });
    it("shouldn't filter if there are no filters", () => {
      const criteria: Filter[] = [];
      component.setFilters(criteria);
      expect(component.users).toEqual(component.fullUsers);
    });
  });

  describe('clearFilters', () => {
    it('should reset table to full dataset', () => {
      component.users = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          userId: 1,
          groupId: 12,
        },
      ];

      component.clearFilters();

      const fullDataset = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          userId: 1,
          groupId: 12,
        },
        {
          userName: 'Michael van Gerwen',
          email: 'michael.vangerwen@darts.local',
          roleType: 'Approver',
          userId: 3,
          groupId: 12,
        },
        {
          userName: 'Fallon Sherrock',
          email: 'fallon.sherrock@darts.local',
          roleType: 'Requestor',
          userId: 2,
          groupId: 13,
        },
      ];

      expect(component.users).toEqual(fullDataset);
    });
  });
});
