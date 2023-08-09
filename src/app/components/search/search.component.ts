import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  specificShow = false;
  rangeShow = false;
  searchText = '';
  form = new FormGroup({});

  // Submit Registration Form
  onSubmit() {
    alert(JSON.stringify(this.form.value));
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

  clearSearch() {
    this.searchText = '';
  }
}
