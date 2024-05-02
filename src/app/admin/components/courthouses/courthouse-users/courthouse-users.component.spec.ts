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
      },
      {
        userName: 'Eric Bristow',
        email: 'eric.bristow@darts.local',
        roleType: 'Requestor',
      },
      {
        userName: 'Fallon Sherrock',
        email: 'fallon.sherrock@darts.local',
        roleType: 'Requestor',
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
          values: ['Requestor'],
          multiselect: true,
        },
      ];

      const expectedUsers = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Requestor',
        },
      ];

      component.setFilters(criteria);
      expect(component.users).toEqual(expectedUsers);
    });
  });

  describe('clearFilters', () => {
    it('should reset table to full dataset', () => {
      component.users = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
        },
      ];

      component.clearFilters();

      const fullDataset = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
        },
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Requestor',
        },
        {
          userName: 'Fallon Sherrock',
          email: 'fallon.sherrock@darts.local',
          roleType: 'Requestor',
        },
      ];

      expect(component.users).toEqual(fullDataset);
    });
  });
});
