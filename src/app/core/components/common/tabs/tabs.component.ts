import { CommonModule } from '@angular/common';
import { Component, computed, contentChildren, model, output } from '@angular/core';
import { TabDirective } from '@directives/tab.directive';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabDirective],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  tabs = contentChildren(TabDirective);
  default = model('');
  // currentTab is either the tab with the name that matches the default input or the first tab
  currentTab = computed(() => this.tabs().find((t) => t.name === this.default())?.template || this.tabs()[0].template);
  tabChange = output<TabDirective>();

  onTabClick(event: MouseEvent, tab: TabDirective) {
    event.preventDefault();
    this.selectTab(tab);
  }

  selectTab(tab: TabDirective) {
    this.default.set(tab.name);
    this.tabChange.emit(tab);
  }
}
