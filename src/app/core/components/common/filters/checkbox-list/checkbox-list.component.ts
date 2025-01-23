import { NgFor } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckboxListItem } from './checkbox-list-item.type';

@Component({
  selector: 'app-checkbox-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './checkbox-list.component.html',
  styleUrl: './checkbox-list.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true,
    },
  ],
})
export class CheckboxListComponent implements OnInit, ControlValueAccessor {
  destroyRef = inject(DestroyRef);
  fb = inject(FormBuilder);
  @Input() checkboxes: CheckboxListItem[] = [];
  @Output() filterChange = new EventEmitter<CheckboxListItem[]>();
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      checkboxes: new FormArray([]),
    });

    this.addCheckboxes();
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.filterChange.emit(this.mapCheckboxValues());
      this.onChange(this.mapCheckboxValues());
      this.onTouched();
    });
  }

  mapCheckboxValues() {
    return this.form.value.checkboxes
      .map((checked: boolean, i: number) => (checked ? this.checkboxes[i] : null))
      .filter((v: CheckboxListItem) => v !== null);
  }

  get checkboxesFormArray() {
    return this.form.controls.checkboxes as FormArray;
  }

  private addCheckboxes() {
    this.checkboxes.forEach(() => this.checkboxesFormArray.push(new FormControl(false)));
  }

  // Control Value Accessor boilerplate
  onChange: (value: CheckboxListItem[]) => void = () => {};
  onTouched = () => {};
  writeValue(): void {
    // no implementation required
  }
  registerOnChange(fn: (value: CheckboxListItem[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
