import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourthouseSearchFormComponent } from './courthouse-search-form.component';

describe('CourthouseSearchFormComponent', () => {
  let component: CourthouseSearchFormComponent;
  let fixture: ComponentFixture<CourthouseSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourthouseSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form values on submit', () => {
    const formValues = {
      courthouseName: 'bristol-1',
      displayName: 'Bristol',
      region: 'South West',
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
      courthouseName: null,
      displayName: null,
      region: null,
    });
    expect(component.clear.emit).toHaveBeenCalled();
  });

  it('should reset form on clearSearch', () => {
    jest.spyOn(component.clear, 'emit');
    component.clearSearch();

    expect(component.form.value).toEqual({
      courthouseName: null,
      displayName: null,
      region: null,
    });
    expect(component.clear.emit).toHaveBeenCalled();
  });

  it('should generate error if over 26 characters', () => {
    // Generate string that is over 256 characters
    // 257 "a" characters will do
    const characters = 257;
    const over256 = new Array(characters + 1).join('a');
    const courthouseName = 'courthouseName';
    // Set the courthouseName value to the characters above
    component.form.get(courthouseName)?.setValue(over256);
    expect(component.getFormControlErrorMessages(courthouseName)).toEqual(['Must be less than 256 characters']);
  });
});
