import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { ApproveRejectFileDeleteComponent } from './approve-reject-file-delete.component';

describe('ApproveRejectFileDeleteComponent', () => {
  let component: ApproveRejectFileDeleteComponent;
  let fixture: ComponentFixture<ApproveRejectFileDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveRejectFileDeleteComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveRejectFileDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return approval choice errors', () => {
    component.deletionApproval.setErrors({ required: true });
    component.confirm();
    const errors = component.getApprovalChoiceErrors();
    expect(errors).toContain('Select your decision');
  });

  it('should emit error summary with approval choice error', () => {
    jest.spyOn(component.errors, 'emit');
    component.deletionApproval.setErrors({ required: true });
    component.confirm();
    expect(component.errors.emit).toHaveBeenCalledWith([
      {
        fieldId: 'deletionApproval',
        message: 'Select your decision',
      },
    ]);
  });

  it('should emit confirmation with approval choice value', () => {
    jest.spyOn(component.confirmation, 'emit');
    component.deletionApproval.setValue(true);
    component.confirm();
    expect(component.confirmation.emit).toHaveBeenCalledWith(true);
  });

  it('should mark all as touched and emit errors if invalid', () => {
    jest.spyOn(component.errors, 'emit');
    component.deletionApproval.setErrors({ required: true });
    component.confirm();
    expect(component.deletionApproval.touched).toBeTruthy();
    expect(component.errors.emit).toHaveBeenCalledWith([
      {
        fieldId: 'deletionApproval',
        message: 'Select your decision',
      },
    ]);
  });

  it('should not emit errors if valid', () => {
    jest.spyOn(component.errors, 'emit');
    component.deletionApproval.setValue(true);
    component.confirm();
    expect(component.errors.emit).not.toHaveBeenCalled();
  });
});
