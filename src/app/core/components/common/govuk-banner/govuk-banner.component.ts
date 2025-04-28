import {AfterViewInit, booleanAttribute, Component, ElementRef, Input, OnDestroy} from '@angular/core';

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
  @Input() text!: string;
  @Input() type: GovukBannerType = 'success';
  @Input() ariaLabel!: string;
  @Input({transform: booleanAttribute}) focusOnChange: boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    if (!this.focusOnChange) {
      return;
    }
    const ngContent = this.elementRef.nativeElement;

    this.observer = new MutationObserver((mutations) => {
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
    this.elementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
