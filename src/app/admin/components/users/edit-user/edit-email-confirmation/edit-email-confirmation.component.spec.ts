import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailConfirmationComponent } from './edit-email-confirmation.component';

describe('EditEmailConfirmationComponent', () => {
  let component: EditEmailConfirmationComponent;
  let fixture: ComponentFixture<EditEmailConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmailConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit errors when form control is invalid', () => {
    jest.spyOn(component.errors, 'emit');
    component.errorMessage = 'Invalid input';
    component.formControl.setValue(null);
    component.onSubmit();
    expect(component.errors.emit).toHaveBeenCalledWith([{ fieldId: 'confirmChange', message: 'Invalid input' }]);
  });

  it('should not emit errors when form control is valid', () => {
    jest.spyOn(component.errors, 'emit');
    component.errorMessage = 'Invalid input';
    component.formControl.setValue(false);
    component.onSubmit();
    expect(component.errors.emit).not.toHaveBeenCalled();
  });

  it('should emit confirm event with true when form control value is truthy', () => {
    jest.spyOn(component.confirm, 'emit');
    component.formControl.setValue(true);
    component.onSubmit();
    expect(component.confirm.emit).toHaveBeenCalledWith(true);
  });

  it('should emit confirm event with false when form control value is falsy', () => {
    jest.spyOn(component.confirm, 'emit');
    component.formControl.setValue(false);
    component.onSubmit();
    expect(component.confirm.emit).toHaveBeenCalledWith(false);
  });
});
