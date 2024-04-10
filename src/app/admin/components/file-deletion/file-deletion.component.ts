import { Component } from '@angular/core';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';

@Component({
  selector: 'app-file-deletion',
  standalone: true,
  imports: [GovukHeadingComponent, TabsComponent, TabDirective],
  templateUrl: './file-deletion.component.html',
  styleUrl: './file-deletion.component.scss',
})
export class FileDeletionComponent {}
