import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-search-error',
  standalone: true,
  imports: [NgSwitchCase, NgSwitchDefault, NgSwitch],
  templateUrl: './search-error.component.html',
  styleUrls: ['./search-error.component.scss'],
})
export class SearchErrorComponent {
  @Input() error: string | null = '';
}
