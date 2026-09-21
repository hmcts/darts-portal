import { NgTemplateOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TabsComponent } from '@common/tabs/tabs.component';

@Component({
  selector: 'app-govuk-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './govuk-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './govuk-tabs.component.scss',
})
export class GovukTabsComponent extends TabsComponent {}
