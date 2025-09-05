import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, computed, contentChildren, inject, input, model, output } from '@angular/core';
import { TabDirective } from '@directives/tab.directive';
import { ActiveTabService } from '@services/active-tab/active-tab.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
  private activeTabService = inject(ActiveTabService);

  tabs = contentChildren(TabDirective);
  default = model('');
  routedTabs = input(false); //When true, parent handles navigation; we still persist (if screenId present) but we do not switch tabs locally

  screenId = input<string | undefined>(undefined);

  private persistedOrDefaultName = computed(() => {
    const id = this.screenId();
    const fromService = id ? this.activeTabService.activeTabs()[id] : undefined;
    return fromService ?? this.default();
  });

  // currentTab is either the tab with the name that matches the default input or the first tab
  currentTab = computed(() => {
    const name = this.persistedOrDefaultName();
    const list = this.tabs();
    return list.find((t) => t.name === name)?.template || list[0]?.template;
  });

  tabChange = output<TabDirective>();

  ngAfterContentInit() {
    // Emit the initially active tab so parents can react on first paint
    const list = this.tabs();
    if (!list?.length) return;

    const name = this.persistedOrDefaultName();
    const active = list.find((t) => t.name === name) ?? list[0];

    // Persist only if screenId is provided
    const id = this.screenId();
    if (id) this.activeTabService.setActiveTab(id, active.name);

    if (!this.routedTabs()) {
      this.default.set(active.name);
      this.tabChange.emit(active); // only emit in non-routed mode
    } else {
      // routed mode: parent controls navigation; we just persist
      this.default.set(active.name); // keep internal state in sync for rendering
    }
  }

  onTabClick(event: MouseEvent, tab: TabDirective) {
    event.preventDefault();
    if (this.routedTabs()) {
      this.tabChange.emit(tab);
    } else {
      this.selectTab(tab);
    }
  }

  selectTab(tab: TabDirective) {
    // Persist only if screenId is provided
    const id = this.screenId();

    if (id) {
      this.activeTabService.setActiveTab(id, tab.name);
    }

    this.default.set(tab.name);
    this.tabChange.emit(tab);
  }
}
