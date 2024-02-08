import { CommonModule, Location } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { TabDirective } from '@directives/tab.directive';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabDirective],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
  router = inject(Router);
  location = inject(Location);

  @ContentChildren(TabDirective) tabs!: QueryList<TabDirective>;
  currentTab!: TemplateRef<unknown>;
  @Output() tabChange = new EventEmitter();
  @Input() default?: string;

  ngAfterContentInit(): void {
    if (this.default) {
      this.tabs.changes.subscribe((tabs: TabDirective[]) => {
        const firstTab = tabs.find((t) => t.name === this.default)?.template;
        if (firstTab) this.currentTab = firstTab;
      });
      const firstTab = this.tabs.find((t) => t.name === this.default)?.template;
      if (firstTab) this.currentTab = firstTab;
    } else {
      const firstTab = this.tabs.first.template;
      if (firstTab) this.currentTab = firstTab;
    }
  }

  onTabClick(event: MouseEvent, tab: TabDirective) {
    event.preventDefault();
    this.setQueryParamsWithoutRedirecting(tab.name);
    this.currentTab = tab.template;
    this.tabChange.emit();
  }

  private setQueryParamsWithoutRedirecting(name: string) {
    const currentPath = this.location.path();
    const queryParams = 'tab=' + name;
    const newPath = currentPath.split('?')[0] + '?' + queryParams;
    this.location.go(newPath);
  }
}
