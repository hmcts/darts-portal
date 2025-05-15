import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-see-more-list',
  imports: [],
  templateUrl: './see-more-list.component.html',
  styleUrl: './see-more-list.component.scss',
})
export class SeeMoreListComponent {
  items = input<string[] | undefined>([]);
  limit = input(2);
  readonly expanded = signal(false);

  readonly uniqueItems = computed(() => [...new Set(this.items() ?? [])]);

  readonly visibleItems = computed(() =>
    this.expanded() ? this.uniqueItems() : this.uniqueItems().slice(0, this.limit())
  );

  readonly hasExtra = computed(() => this.uniqueItems().length > this.limit());

  toggle(): void {
    this.expanded.set(!this.expanded());
  }
}
