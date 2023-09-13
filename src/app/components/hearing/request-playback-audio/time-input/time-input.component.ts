/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
})
export class TimeInputComponent implements OnInit {
  form!: FormGroup;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }
}
