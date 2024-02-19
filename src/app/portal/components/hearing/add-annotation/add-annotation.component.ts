import { Component, Input, OnInit, inject } from '@angular/core';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { HeaderService } from '@services/header/header.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-add-annotation',
  standalone: true,
  imports: [BreadcrumbComponent, BreadcrumbDirective],
  templateUrl: './add-annotation.component.html',
  styleUrl: './add-annotation.component.scss',
})
export class AddAnnotationComponent implements OnInit {
  @Input() caseId!: string;
  @Input() caseNumber!: number;
  @Input() hearingDate!: DateTime;

  headerService = inject(HeaderService);

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }
}
