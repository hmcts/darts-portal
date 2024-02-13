import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-conflict',
  standalone: true,
  imports: [CommonModule, GovukHeadingComponent, RouterLink],
  templateUrl: './conflict.component.html',
  styleUrls: ['./conflict.component.scss'],
})
export class ConflictComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);

  @Input() header?: string;
  @Input() body?: string;
  @Input() link?: { text: string; href: string };

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  ngOnDestroy(): void {
    this.headerService.showNavigation();
  }
}
