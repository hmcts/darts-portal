import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityRole } from '@admin-types/index';
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
        id: 1,
        groups: [],
        role: {} as SecurityRole,
      },
      {
        userName: 'Michael van Gerwen',
        email: 'michael.vangerwen@darts.local',
        roleType: 'Approver',
        id: 3,
        groups: [],
        role: {} as SecurityRole,
      },
      {
        userName: 'Fallon Sherrock',
        email: 'fallon.sherrock@darts.local',
        roleType: 'Requestor',
        id: 2,
        groups: [],
        role: {} as SecurityRole,
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setFilters', () => {
    it('should filter table based on user name amd role filters', () => {
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
          id: 1,
          groups: [],
          role: {},
        },
      ];

      component.setFilters(criteria);
      expect(component.users).toEqual(expectedUsers);
    });
    it('should filter table based on user name filters', () => {
      const criteria: Filter[] = [
        {
          displayName: 'User Name',
          name: 'userName',
          values: ['Eric Bristow'],
          multiselect: true,
        },
      ];

      const expectedUsers = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          id: 1,
          groups: [],
          role: {},
        },
      ];

      component.setFilters(criteria);
      expect(component.users).toEqual(expectedUsers);
    });
    it('should filter table based on role filters', () => {
      const criteria: Filter[] = [
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
          id: 1,
          groups: [],
          role: {},
        },
        {
          email: 'michael.vangerwen@darts.local',

          roleType: 'Approver',
          id: 3,
          userName: 'Michael van Gerwen',
          groups: [],
          role: {},
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

  describe('outputSelectedRows', () => {
    it('should emit a value if there are values selected', () => {
      const emitSpy = jest.spyOn(component.selectRowsEvent, 'emit');
      component.selectedRows = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          id: 1,
          groups: [],
          role: {} as SecurityRole,
        },
      ];
      component.outputSelectedRows();
      expect(emitSpy).toHaveBeenCalledWith([
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          id: 1,
          groups: [],
          role: {},
        },
      ]);
    });
    it('should not emit a value if there are no values selected', () => {
      const emitSpy = jest.spyOn(component.selectRowsEvent, 'emit');
      component.selectedRows = [];
      component.outputSelectedRows();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('clearFilters', () => {
    it('should reset table to full dataset', () => {
      component.users = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          id: 1,
          groups: [],
          role: {} as SecurityRole,
        },
      ];

      component.clearFilters();

      const fullDataset = [
        {
          userName: 'Eric Bristow',
          email: 'eric.bristow@darts.local',
          roleType: 'Approver',
          id: 1,
          groups: [],
          role: {},
        },
        {
          userName: 'Michael van Gerwen',
          email: 'michael.vangerwen@darts.local',
          roleType: 'Approver',
          id: 3,
          groups: [],
          role: {},
        },
        {
          userName: 'Fallon Sherrock',
          email: 'fallon.sherrock@darts.local',
          roleType: 'Requestor',
          id: 2,
          groups: [],
          role: {},
        },
      ];

      expect(component.users).toEqual(fullDataset);
    });
  });
});
