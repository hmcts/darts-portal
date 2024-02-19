import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { HeaderService } from '@services/header/header.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-add-annotation',
  standalone: true,
  imports: [BreadcrumbComponent, BreadcrumbDirective, LuxonDatePipe],
  templateUrl: './add-annotation.component.html',
  styleUrl: './add-annotation.component.scss',
})
export class AddAnnotationComponent implements OnInit {
  caseId!: string;
  caseNumber!: number;
  hearingDate!: DateTime;

  headerService = inject(HeaderService);
  router = inject(Router);

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.caseId = state!.caseId;
    this.caseNumber = state!.caseNumber;
    this.hearingDate = state!.hearingDate;
  }

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }
}
