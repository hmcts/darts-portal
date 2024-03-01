import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs/internal/observable/of';
import { CreateUserComponent } from './create-user.component';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let userAdminService: Partial<UserAdminService>;

  beforeEach(async () => {
    userAdminService = {
      createUser: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateUserComponent],
      providers: [{ provide: UserAdminService, useValue: userAdminService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set isConfirmation to true and hide navigation', () => {
    const headerService = TestBed.inject(HeaderService);
    jest.spyOn(headerService, 'hideNavigation');

    component.isConfirmation = true;

    expect(component.isConfirmation).toBe(true);
    expect(headerService.hideNavigation).toHaveBeenCalled();
  });

  it('set isConfirmation to false and show navigation', () => {
    const headerService = TestBed.inject(HeaderService);
    jest.spyOn(headerService, 'showNavigation');

    component.isConfirmation = false;

    expect(component.isConfirmation).toBe(false);
    expect(headerService.showNavigation).toHaveBeenCalled();
  });

  it('onSubmit should set formValues and isConfirmation to true', () => {
    const formValues = { fullName: 'John Doe', email: 'test@test', description: 'test' };
    component.onSubmit(formValues);

    expect(component.formValues).toEqual(formValues);
    expect(component.isConfirmation).toBe(true);
  });

  it('onConfirmUserDetails should call userAdminService.createUser and navigate to admin/users', () => {
    const router = TestBed.inject(Router);
    const user = { id: 1 } as unknown as User;
    jest.spyOn(userAdminService, 'createUser').mockReturnValue(of(user));
    jest.spyOn(router, 'navigate');

    component.formValues = { fullName: 'John Doe', email: 'test@test', description: 'test' };
    component.onConfirmUserDetails();

    expect(userAdminService.createUser).toHaveBeenCalledWith(component.formValues);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users', user.id], { queryParams: { newUser: true } });
  });

  it('onBack should set isConfirmation to false', () => {
    component.isConfirmation = true;
    component.onBack();

    expect(component.isConfirmation).toBe(false);
  });

  it('onCancel should navigate to admin/users', () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
  });
});
