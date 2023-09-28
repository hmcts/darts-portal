import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-error.component.html',
  styleUrls: ['./search-error.component.scss'],
})
export class SearchErrorComponent {
  @Input() error: string | null = '';
}
