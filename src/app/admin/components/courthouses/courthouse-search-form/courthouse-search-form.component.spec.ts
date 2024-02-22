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
});
