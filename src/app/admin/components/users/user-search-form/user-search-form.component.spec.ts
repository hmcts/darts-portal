import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchFormComponent } from './user-search-form.component';

describe('UserSearchFormComponent', () => {
  let component: UserSearchFormComponent;
  let fixture: ComponentFixture<UserSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form values on submit', () => {
    const formValues = {
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      userStatus: 'active',
    };

    jest.spyOn(component.submitForm, 'emit');
    component.form.setValue(formValues);
    component.onSubmit();

    expect(component.submitForm.emit).toHaveBeenCalledWith(formValues);
  });

  it('should reset form on clearSearch', () => {
    jest.spyOn(component.clear, 'emit');
    component.clearSearch();

    expect(component.form.value).toEqual({
      fullName: null,
      email: null,
      userStatus: 'active',
    });
    expect(component.clear.emit).toHaveBeenCalled();
  });
});
