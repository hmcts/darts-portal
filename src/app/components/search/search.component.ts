import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = new FormControl('');

  public search() {
    if (!this.searchTerm.value) {
      return;
    }
    console.log('searching cases...', this.searchTerm.value);
    alert(`Searching cases using search term "${this.searchTerm.value}"`);
    this.searchTerm.setValue('');
  }
}
