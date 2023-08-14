import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';

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
    }, 500);
  }
}
