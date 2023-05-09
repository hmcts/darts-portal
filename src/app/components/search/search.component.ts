import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppInsightsService } from 'src/app/services/app-insights/app-insights.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = new FormControl('');

  constructor(private appInsightsService: AppInsightsService) {}

  public search() {
    if (!this.searchTerm.value) {
      return;
    }
    console.log('searching cases...', this.searchTerm.value);
    this.appInsightsService.logEvent('CASE_SEARCH', { searchTerm: this.searchTerm.value });
    alert(`Searching cases using search term "${this.searchTerm.value}"`);
    this.searchTerm.setValue('');
  }
}
