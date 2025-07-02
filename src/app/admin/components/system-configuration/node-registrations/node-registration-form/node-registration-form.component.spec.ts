import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeRegistrationFormComponent } from './node-registration-form.component';

describe('NodeRegistrationFormComponent', () => {
  let component: NodeRegistrationFormComponent;
  let fixture: ComponentFixture<NodeRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeRegistrationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit lowercase trimmed value when onChange is called', () => {
    const emitSpy = jest.spyOn(component.courthouseFilter, 'emit');

    component.form.setValue({ courthouse: '  Central Court  ' });

    component.onChange();

    expect(emitSpy).toHaveBeenCalledWith('central court');
  });

  it('should emit empty string if input is blank or only whitespace', () => {
    const emitSpy = jest.spyOn(component.courthouseFilter, 'emit');

    component.form.setValue({ courthouse: '   ' });

    component.onChange();

    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('should not throw if courthouse is null or undefined', () => {
    const emitSpy = jest.spyOn(component.courthouseFilter, 'emit');

    component.form.patchValue({ courthouse: undefined });

    expect(() => component.onChange()).not.toThrow();
    expect(emitSpy).toHaveBeenCalledWith('');
  });
});
