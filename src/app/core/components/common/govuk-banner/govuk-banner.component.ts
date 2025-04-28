import { AfterViewInit, booleanAttribute, Component, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { ScrollService } from '@services/scroll/scroll.service';

export type GovukBannerType = 'success' | 'warning' | 'information';

@Component({
  selector: 'app-govuk-banner',
  standalone: true,
  imports: [],
  templateUrl: './govuk-banner.component.html',
  styleUrls: ['./govuk-banner.component.scss'],
})
export class GovukBannerComponent implements AfterViewInit, OnDestroy {
  private observer!: MutationObserver;
  scrollService = inject(ScrollService);

  @Input() text!: string;
  @Input() type: GovukBannerType = 'success';
  @Input() ariaLabel!: string;
  @Input({ transform: booleanAttribute }) focusOnChange: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (!this.focusOnChange) {
      return;
    }
    const ngContent = this.elementRef.nativeElement;

    this.observer = new MutationObserver(() => {
      this.focusBanner();
    });

    this.observer.observe(ngContent, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    this.focusBanner();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private focusBanner() {
    this.scrollService.scrollToElement(this.elementRef.nativeElement);
  }
}
