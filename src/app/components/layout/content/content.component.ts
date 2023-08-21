import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ContentComponent implements OnInit {
  public ngOnInit() {
    // initialize javascript for accordion component to enable open/close button
    setTimeout(() => initAll(), 500);
  }
}
