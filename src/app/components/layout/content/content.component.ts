import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { initAll as initallAllScotland } from '@scottish-government/pattern-library/src/all';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  public ngOnInit() {
    // initialize javascript for accordion component to enable open/close button
    setTimeout(() => {
      initAll();
      initallAllScotland();
    }, 500);
  }
}
