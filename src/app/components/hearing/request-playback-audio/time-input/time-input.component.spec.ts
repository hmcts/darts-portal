import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

import { TimeInputComponent } from './time-input.component';

describe('TimeInputComponent', () => {
  let component: TimeInputComponent;
  let fixture: ComponentFixture<TimeInputComponent>;
  const fg: FormGroup = new FormGroup({
    hours: new FormControl(''),
    minutes: new FormControl(''),
    seconds: new FormControl(''),
  });

  const fgd: FormGroupDirective = new FormGroupDirective([], []);
  fgd.form = fg;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimeInputComponent],
      providers: [{ provide: ControlContainer, useValue: fgd }],
    });
    fixture = TestBed.createComponent(TimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
