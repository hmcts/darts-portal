import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { of } from 'rxjs';
import { GroupRecordComponent } from './group-record.component';

describe('GroupRecordComponent', () => {
  let component: GroupRecordComponent;
  let fixture: ComponentFixture<GroupRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRecordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        {
          provide: GroupsService,
          useValue: {
            getGroup: jest.fn().mockReturnValue(of({})),
            getGroupAndRole: jest.fn(),
            assignCourthousesToGroup: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: CourthouseService,
          useValue: { getCourthouses: jest.fn().mockReturnValue(of({})) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update courthouses when onUpdateCourthouses is called', () => {
    const courthouseIds = [1, 2, 3];
    component.groupId = 1;
    component.onUpdateCourthouses(courthouseIds);
    expect(component.groupsService.assignCourthousesToGroup).toHaveBeenCalledWith(1, courthouseIds);
  });
});
