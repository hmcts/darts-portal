import { NgForOf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbDirective } from 'src/app/core/directives/breadcrumb.directive';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbDirective, RouterLink, NgForOf, NgTemplateOutlet],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @ContentChildren(BreadcrumbDirective) breadcrumbs!: QueryList<BreadcrumbDirective>;
}
