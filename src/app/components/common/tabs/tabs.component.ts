import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDirective } from 'src/app/directives/tab.directive';

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

  ngAfterContentInit(): void {
    const firstTab = this.tabs.first.template;
    if (firstTab) this.currentTab = firstTab;
  }

  onTabClick(event: MouseEvent, tab: TabDirective) {
    event.preventDefault();
    this.currentTab = tab.template;
    this.tabChange.emit();
  }
}
