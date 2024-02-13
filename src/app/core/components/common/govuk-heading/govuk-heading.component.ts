import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-govuk-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-heading.component.html',
  styleUrl: './govuk-heading.component.scss',
})
export class GovukHeadingComponent implements OnInit {
  @Input() caption = '';
  @Input() size: 's' | 'm' | 'l' | 'xl' = 'l';
  @Input() tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h1';
  @Input() headingClass = '';
  @Input() captionClass = '';

  ngOnInit(): void {
    this.headingClass = `govuk-heading-${this.size}`;
    this.captionClass = `govuk-caption-${this.size}`;
  }
}
