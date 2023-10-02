import { AfterViewInit, Component, ContentChildren, OnInit, QueryList, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDirective } from 'src/app/directives/tab.directive';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabDirective],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterViewInit {
  @ContentChildren(TabDirective) tabs!: QueryList<TabDirective>;
  currentTab!: TemplateRef<any>;

  ngAfterViewInit(): void {
    const firstTab = this.tabs.get(0)?.template;
    if (firstTab) this.currentTab = firstTab;
  }
}
