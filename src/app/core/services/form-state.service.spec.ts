import { TestBed } from '@angular/core/testing';

import { FormStateService } from './form-state.service';

describe('FormStateService', () => {
  let service: FormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get form values', () => {
    const screenId = 'testScreen';
    const formValues = { field1: 'value1', field2: 'value2' };

    service.setFormValues(screenId, formValues);
    const result = service.getFormValues<typeof formValues>(screenId);

    expect(result).toEqual(formValues);
  });

  it('should return null for non-existing form values', () => {
    const result = service.getFormValues('nonExistingScreen');
    expect(result).toBeNull();
  });

  it('should clear form values', () => {
    const screenId = 'testScreen';
    const formValues = { field1: 'value1', field2: 'value2' };

    service.setFormValues(screenId, formValues);
    service.clearFormValues(screenId);
    const result = service.getFormValues<typeof formValues>(screenId);

    expect(result).toBeNull();
  });
});
