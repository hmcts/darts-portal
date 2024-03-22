import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFormValue, SecurityGroup } from '@admin-types/index';
import { GroupsService } from '@services/groups/groups.service';
import { of } from 'rxjs';
import { CreateEditGroupComponent } from './create-edit-group.component';

describe('CreateEditGroupComponent', () => {
  let component: CreateEditGroupComponent;
  let fixture: ComponentFixture<CreateEditGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditGroupComponent],
      providers: [
        {
          provide: GroupsService,
          useValue: {
            getGroups: jest.fn().mockReturnValue(of([])),
            updateGroup: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should navigate back if edit mode and group is not provided', () => {
      jest.spyOn(component.router, 'navigate');
      component.isEdit = true;
      component.group = null as unknown as SecurityGroup;
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith(['admin/groups']);
    });
  });

  describe('onSave', () => {
    it('should call updateGroup if in edit mode', () => {
      const formValues: GroupFormValue = { name: 'test', description: 'test', role: 'test' };
      jest.spyOn(component.groupService, 'updateGroup');
      component.group = { id: 1 } as SecurityGroup;
      component.isEdit = true;
      component.onSave(formValues);
      expect(component.groupService.updateGroup).toHaveBeenCalledWith(1, formValues);
    });

    it('should not call updateGroup if not in edit mode', () => {
      const formValues: GroupFormValue = { name: '', description: '', role: '' };
      component.group = { id: 1 } as SecurityGroup;
      jest.spyOn(component.groupService, 'updateGroup');
      component.isEdit = false;
      component.onSave(formValues);
      expect(component.groupService.updateGroup).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should navigate to the group details page if in edit mode', () => {
      component.group = { id: 1 } as SecurityGroup;
      const cancelUrl = `admin/groups/${component.group.id}`;
      jest.spyOn(component.router, 'navigate');

      component.isEdit = true;
      component.cancel();

      expect(component.router.navigate).toHaveBeenCalledWith([cancelUrl]);
    });

    it('should navigate to the groups list page if not in edit mode', () => {
      const cancelUrl = 'admin/groups';
      jest.spyOn(component.router, 'navigate');

      component.isEdit = false;
      component.cancel();

      expect(component.router.navigate).toHaveBeenCalledWith([cancelUrl]);
    });
  });
});
