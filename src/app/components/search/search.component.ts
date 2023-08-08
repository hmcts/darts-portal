import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  constructor(public fb: FormBuilder) {}

  specificShow = false;
  rangeShow = false;
  /*########### Template Driven Form ###########*/
  searchForm = this.fb.group({
    property: 'example',
  });
  // Submit Registration Form
  onSubmit() {
    alert(JSON.stringify(this.searchForm.value));
  }

  //Fires on radio input checked change
  onItemChange(type: string, evt: Event) {
    console.log(evt);
    const radio = evt.target as HTMLInputElement;
    if (evt.target) {
      if (radio.checked) {
        this.toggleRadioSelected(true, type);
      } else {
        this.toggleRadioSelected(false, type);
      }
    }
  }

  toggleRadioSelected(selected: boolean, type: string) {
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
