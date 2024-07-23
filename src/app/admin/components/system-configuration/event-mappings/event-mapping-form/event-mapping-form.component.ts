import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HumanizeInitCapPipe } from '@pipes/humanizeInitCap';

export type EventMappingForm = {
  searchText: string;
  eventHandler: string;
  statusFilter: string;
  withRestrictions: boolean;
  withoutRestrictions: boolean;
};

@Component({
  selector: 'app-event-mapping-form',
  standalone: true,
  templateUrl: './event-mapping-form.component.html',
  styleUrl: './event-mapping-form.component.scss',
  imports: [ReactiveFormsModule, HumanizeInitCapPipe],
})
export class EventMappingFormComponent implements OnInit {
  form!: FormGroup;
  fb = inject(FormBuilder);

  @Input() eventHandlers!: string[];
  @Output() filterValues = new EventEmitter<EventMappingForm>();

  ngOnInit(): void {
    this.form = this.fb.group({
      searchText: [''],
      eventHandler: [''],
      statusFilter: ['active'],
      withRestrictions: [true],
      withoutRestrictions: [true],
    });
  }

  onChange(): void {
    this.filterValues.emit(this.form.value);
    if (!this.form.controls.withRestrictions.value && !this.form.controls.withoutRestrictions.value) {
      //Ensure checkboxes cannot be both unchecked
      this.form.controls.withRestrictions.setValue(true);
      this.form.controls.withoutRestrictions.setValue(true);
    }
  }
}
