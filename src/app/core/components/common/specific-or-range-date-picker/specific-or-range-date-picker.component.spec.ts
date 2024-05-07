import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { dateRangeValidator } from '@validators/date-range.validator';
import { transcriptSearchDateValidators } from 'src/app/admin/components/transcripts/search-transcripts-form/search-transcripts-form.component';
import { SpecificOrRangeDatePickerComponent } from './specific-or-range-date-picker.component';

describe('SpecificOrRangeDatePickerComponent', () => {
  let component: SpecificOrRangeDatePickerComponent;
  let fixture: ComponentFixture<SpecificOrRangeDatePickerComponent>;

  // Form group and validation to be passed in from parent from as a control container.
  const parentFormGroup: FormGroup = new FormGroup(
    {
      type: new FormControl(''),
      specific: new FormControl('', transcriptSearchDateValidators),
      from: new FormControl('', transcriptSearchDateValidators),
      to: new FormControl('', transcriptSearchDateValidators),
    },
    { validators: [dateRangeValidator('from', 'to')] }
  );

  const mockFormGroupDirective: FormGroupDirective = new FormGroupDirective([], []);
  mockFormGroupDirective.form = parentFormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificOrRangeDatePickerComponent],
      providers: [{ provide: ControlContainer, useValue: mockFormGroupDirective }],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecificOrRangeDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#dateTypeControl', () => {
    expect(component.dateTypeControl).toBe(component.form.controls.type);
  });

  it('#fromDateControl', () => {
    expect(component.fromDateControl).toBe(component.form.controls.from);
  });

  it('#toDateControl', () => {
    expect(component.toDateControl).toBe(component.form.controls.to);
  });

  it('#requestedDateSpecificControl', () => {
    expect(component.specificDateControl).toBe(component.form.controls.specific);
  });

  describe('#ngOnInit', () => {
    it('should reset date values when requested date type changes', () => {
      component.specificDateControl.setValue('test');
      component.fromDateControl.setValue('test');
      component.toDateControl.setValue('test');

      component.dateTypeControl.setValue('range');

      expect(component.specificDateControl.value).toBe('');
      expect(component.fromDateControl.value).toBe('');
      expect(component.toDateControl.value).toBe('');
    });
  });

  it('#setInputValue', () => {
    component.setInputValue('test', 'type');
    expect(component.form.get('type')?.value).toBe('test');
  });

  describe('Validation errors', () => {
    it('toDateControl should be required when fromDateControl is set', () => {
      component.dateTypeControl.setValue('range');
      component.fromDateControl.setValue('01/01/2022');
      expect(component.toDateControl.hasError('required')).toBe(true);
    });

    it('fromDateControl should be required when toDateControl is set', () => {
      component.dateTypeControl.setValue('range');
      component.toDateControl.setValue('01/01/2022');
      expect(component.fromDateControl.hasError('required')).toBe(true);
    });

    it('dates should not be in the future', () => {
      component.specificDateControl.setValue('01/01/3000');
      expect(component.specificDateControl.hasError('futureDate')).toBe(true);

      component.dateTypeControl.setValue('range');
      component.fromDateControl.setValue('01/01/3000');
      expect(component.fromDateControl.hasError('futureDate')).toBe(true);

      component.toDateControl.setValue('01/01/3000');
      expect(component.toDateControl.hasError('futureDate')).toBe(true);
    });

    it('dates should be real dates', () => {
      component.fromDateControl.setValue('30/02/2022');
      expect(component.fromDateControl.hasError('realDate')).toBe(true);

      component.toDateControl.setValue('30/02/2022');
      expect(component.toDateControl.hasError('realDate')).toBe(true);

      component.specificDateControl.setValue('30/02/2022');
      expect(component.specificDateControl.hasError('realDate')).toBe(true);
    });

    it('invalid if toDate is before fromDate', () => {
      component.dateTypeControl.setValue('range');
      component.fromDateControl.setValue('01/01/2022');
      component.toDateControl.setValue('01/01/2021');

      expect(component.form.hasError('dateRange')).toBe(true);
      expect(component.fromDateControl.hasError('dateRange')).toBe(true);
      expect(component.toDateControl.hasError('dateRange')).toBe(true);
    });

    it('valid if fromDate is before toDate', () => {
      component.dateTypeControl.setValue('range');
      component.fromDateControl.setValue('01/01/2021');
      component.toDateControl.setValue('01/01/2022');

      expect(component.form.hasError('dateRange')).toBe(false);
      expect(component.fromDateControl.hasError('dateRange')).toBe(false);
      expect(component.toDateControl.hasError('dateRange')).toBe(false);
    });
  });
});
