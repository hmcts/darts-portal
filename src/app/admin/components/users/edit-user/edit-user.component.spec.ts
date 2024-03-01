import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { EditUserComponent } from './edit-user.component';

const mockNavigationExtras = {
  extras: {
    state: { user: { fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } },
  },
};

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let fakeUserAdminService: Partial<UserAdminService>;
  let router: Router;

  beforeEach(async () => {
    fakeUserAdminService = {
      updateUser: () => of({} as User),
    };
    await TestBed.configureTestingModule({
      imports: [EditUserComponent, RouterTestingModule],
      providers: [{ provide: UserAdminService, useValue: fakeUserAdminService }],
    }).compileComponents();

    router = TestBed.inject(Router);

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigationExtras as unknown as Navigation);

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /admin/users if no user is provided', () => {
    component.user = null as unknown as User;
    jest.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
  });

  it('should check if email is changed', () => {
    component.user = { fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;
    component.updatedUser = { fullName: 'Test', email: 'test2@test.com', description: 'test' };

    const result = component.isEmailChanged();

    expect(result).toBe(true);
  });

  it('should save user if email is not changed', () => {
    component.user = { fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;
    component.updatedUser = { fullName: 'Test', email: 'test@test.com', description: 'test' };

    jest.spyOn(component, 'saveUser');

    component.onSubmit(component.updatedUser);

    expect(component.saveUser).toHaveBeenCalled();
  });

  it('should show email change confirmation if email is changed', () => {
    component.user = { fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;
    component.updatedUser = { fullName: 'Test', email: 'test2@test.com', description: 'test' };

    component.onSubmit(component.updatedUser);

    expect(component.showEmailChangeConfirmation).toBe(true);
  });

  it('should update email if user confirms email change', () => {
    component.user = { fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;
    component.updatedUser = { fullName: 'Test', email: 'test2@test.com', description: 'test' };

    component.onConfirmEmailChange(true);

    expect(component.updatedUser.email).toBe('test2@test.com');
  });

  it('should not update email if user does not confirm email change', () => {
    component.user = { fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;
    component.updatedUser = { fullName: 'Test', email: 'test2@test.com', description: 'test' };

    component.onConfirmEmailChange(false);

    expect(component.updatedUser.email).toBe('test@test.com');
  });

  it('should save user and navigate to updated user page', () => {
    component.user = { id: 1, fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;
    component.updatedUser = { fullName: 'Test', email: 'test2@test.com', description: 'test' };

    jest.spyOn(component.userAdminService, 'updateUser').mockReturnValue(of({ id: 1 } as unknown as User));
    jest.spyOn(router, 'navigate');

    component.saveUser();

    expect(component.userAdminService.updateUser).toHaveBeenCalledWith(1, component.updatedUser);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users', 1], { queryParams: { updated: true } });
  });

  it('should navigate to user page on cancel', () => {
    component.user = { id: 1, fullName: 'Test', emailAddress: 'test@test.com', description: 'test' } as User;

    jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/users', 1]);
  });
});
