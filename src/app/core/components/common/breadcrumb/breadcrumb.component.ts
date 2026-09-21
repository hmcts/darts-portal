import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @ContentChildren(BreadcrumbDirective) breadcrumbs!: QueryList<BreadcrumbDirective>;
}
