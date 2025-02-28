import { FormControl, FormGroup } from '@angular/forms';
import { beforeTimeValidator } from './before-time.validator';

describe('beforeTimeValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      startTime: new FormGroup({
        hours: new FormControl(null),
        minutes: new FormControl(null),
        seconds: new FormControl(null),
      }),
      endTime: new FormGroup({
        hours: new FormControl(null),
        minutes: new FormControl(null),
        seconds: new FormControl(null),
      }),
    });
  });

  it('should return null when startTime and endTime are valid', () => {
    formGroup.get('startTime.hours')?.setValue(10);
    formGroup.get('startTime.minutes')?.setValue(30);
    formGroup.get('startTime.seconds')?.setValue(0);

    formGroup.get('endTime.hours')?.setValue(11);
    formGroup.get('endTime.minutes')?.setValue(0);
    formGroup.get('endTime.seconds')?.setValue(0);

    expect(beforeTimeValidator(formGroup)).toBeNull();
  });

  it('should return an error when endTime is before startTime', () => {
    formGroup.get('startTime.hours')?.setValue(12);
    formGroup.get('startTime.minutes')?.setValue(30);
    formGroup.get('startTime.seconds')?.setValue(0);

    formGroup.get('endTime.hours')?.setValue(12);
    formGroup.get('endTime.minutes')?.setValue(15);
    formGroup.get('endTime.seconds')?.setValue(0);

    expect(beforeTimeValidator(formGroup)).toEqual({ endTimeBeforeStartTime: true });
  });

  it('should return null if either startTime or endTime is missing', () => {
    formGroup.get('startTime.hours')?.setValue(10);
    formGroup.get('startTime.minutes')?.setValue(30);
    formGroup.get('startTime.seconds')?.setValue(0);

    formGroup.setControl('endTime', null);

    expect(beforeTimeValidator(formGroup)).toBeNull();
  });

  it('should remove the error when endTime is corrected', () => {
    formGroup.get('startTime.hours')?.setValue(12);
    formGroup.get('startTime.minutes')?.setValue(30);
    formGroup.get('startTime.seconds')?.setValue(0);

    formGroup.get('endTime.hours')?.setValue(12);
    formGroup.get('endTime.minutes')?.setValue(15);
    formGroup.get('endTime.seconds')?.setValue(0);

    beforeTimeValidator(formGroup);
    expect(formGroup.get('endTime')?.errors?.endTimeAfterStart).toBeTruthy();

    formGroup.get('endTime.hours')?.setValue(13);
    formGroup.get('endTime.minutes')?.setValue(0);
    formGroup.get('endTime.seconds')?.setValue(0);

    beforeTimeValidator(formGroup);

    expect(formGroup.get('endTime')?.errors).toBeNull();
  });

  it('should not add an error if validation is skipped due to other errors', () => {
    formGroup.get('endTime')?.setErrors({ required: true });

    formGroup.get('startTime.hours')?.setValue(12);
    formGroup.get('startTime.minutes')?.setValue(30);
    formGroup.get('startTime.seconds')?.setValue(0);

    formGroup.setControl('endTime', null);

    expect(beforeTimeValidator(formGroup)).toBeNull();
  });

  it('should call updateValueAndValidity() when startTime or endTime is dirty', () => {
    const startTimeCtrl = formGroup.get('startTime');
    const endTimeCtrl = formGroup.get('endTime');

    const startUpdateSpy = jest.spyOn(startTimeCtrl!, 'updateValueAndValidity');
    const endUpdateSpy = jest.spyOn(endTimeCtrl!, 'updateValueAndValidity');

    startTimeCtrl?.markAsDirty();
    endTimeCtrl?.markAsDirty();

    beforeTimeValidator(formGroup);

    expect(startUpdateSpy).toHaveBeenCalledWith({ onlySelf: true });
    expect(endUpdateSpy).toHaveBeenCalledWith({ onlySelf: true });
  });
});
