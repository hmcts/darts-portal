import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  constructor(public fb: FormBuilder) {}
  /*########### Template Driven Form ###########*/
  searchForm = this.fb.group({
    property: 'example',
  });
  // Submit Registration Form
  onSubmit() {
    alert(JSON.stringify(this.searchForm.value));
  }

  // specific-date id for specific radio
  //date-range id for date range radio

  onItemChange(type: String, evt: any) {
    console.log('type', type);
    console.log(' Event checked is : ', evt.target.checked);
    if (evt.target) {
      if (evt.target.checked) {
      }
    }
  }

  isRadioSelected(type: String) {
    // return this.specific === type;
    // if (type == 'speciifc') {
    //   this.specificRadio = !this.specificRadio;
    // }
    // if (type == 'range') {
    //   //Ref function to show range items
    // }
  }

  hideDateItems(type: String) {
    //date-range-items id for set of date inputs
    //specific-date-items id for specific items
  }
}
