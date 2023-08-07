import { Component, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  constructor(public fb: FormBuilder) {}

  specificShow: boolean = false;
  rangeShow: boolean = false;
  /*########### Template Driven Form ###########*/
  searchForm = this.fb.group({
    property: 'example',
  });
  // Submit Registration Form
  onSubmit() {
    alert(JSON.stringify(this.searchForm.value));
  }

  onItemChange(type: String, evt: any) {
    if (evt.target) {
      if (evt.target.checked) {
        this.toggleRadioSelected(true, type);
      } else {
        this.toggleRadioSelected(false, type);
      }
    }
  }

  toggleRadioSelected(selected: boolean, type: String) {
    if (type == 'specific') {
      //Show specific datepicker
      this.specificShow = selected;
      this.rangeShow = false;
    }
    if (type == 'range') {
      //show range datepickers
      this.rangeShow = selected;
      this.specificShow = false;
    }
  }
}
