import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl } from '@angular/forms';
import { CharacterCountTextareaComponent } from './character-count-textarea.component';

describe('CharacterCountTextareaComponent', () => {
  let component: CharacterCountTextareaComponent;
  let fixture: ComponentFixture<CharacterCountTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCountTextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCountTextareaComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    component.id = 'change-reason';
    component.name = 'reason';
    component.ariaDescribedBy = 'change-reason';
    expect(component).toBeTruthy();
  });

  it('should get the remaining Character Count', () => {
    component.control.patchValue('Rejected for late');
    const result = component.remainingCharacterCount;
    expect(result).toEqual(component.maxCharacterLimit - component.control.value.length);
  });

  it('should get the remaining Character Count with custom max Character Limit', () => {
    component.control.patchValue('Eagle');
    component.maxCharacterLimit = 200;
    const result = component.remainingCharacterCount;
    expect(result).toEqual(195);
  });
});
