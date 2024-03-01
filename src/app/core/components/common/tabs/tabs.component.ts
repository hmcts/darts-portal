import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { TabDirective } from '@directives/tab.directive';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabDirective],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabDirective) tabs!: QueryList<TabDirective>;
  currentTab!: TemplateRef<unknown>;
  @Output() tabChange = new EventEmitter();
  @Input() default?: string;

  ngAfterContentInit(): void {
    this.tabs.changes.subscribe((tabs: TabDirective[]) => {
      this.selectDefaultTab(tabs);
    });
    this.selectDefaultTab(this.tabs.toArray());
  }

  selectDefaultTab(tabs: TabDirective[]): void {
    const defaultTab = tabs.find((t) => t.name === this.default);
    const firstTab = tabs[0];
    const tabToSelect = defaultTab || firstTab;
    if (tabToSelect) {
      this.selectTab(tabToSelect);
    }
  }

  onTabClick(event: MouseEvent, tab: TabDirective) {
    event.preventDefault();
    this.selectTab(tab);
  }

  selectTab(tab: TabDirective) {
    this.currentTab = tab.template;
    this.tabChange.emit(tab);
  }
}
