import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input({ required: true }) tabs: string[] = [];
  @Output() tabChange = new EventEmitter<string>();
  @Input() activeTab!: string;

  ngOnInit(): void {
    if (!this.activeTab) {
      this.activeTab = this.tabs[0];
    }
  }

  onTabClick(event: Event, tab: string) {
    event.preventDefault();
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
}
