import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
})
export class SearchComponent {
  dateInputType!: 'specific' | 'range';

  form = new FormGroup({
    searchText: new FormControl(),
    courthouseText: new FormControl(),
    courtroomText: new FormControl(),
    defendantNameText: new FormControl(),
    judgeNameText: new FormControl(),
    keywordsText: new FormControl(),
  });

  // Submit Registration Form
  onSubmit() {
    alert(JSON.stringify(this.form.value));
  }

  toggleRadioSelected(type: 'specific' | 'range') {
    this.dateInputType = type;
  }

  clearSearch() {
    this.form.reset();
  }
}
