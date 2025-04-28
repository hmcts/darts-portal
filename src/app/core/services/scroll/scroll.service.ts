import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollToElement(element: any) {
    setTimeout(() => {
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
        console.error(`Element ${element} not found`);
      }
    }, 100);
  }

  scrollTo(selector: string) {
    this.scrollToElement(document.querySelector<HTMLElement>(selector));
  }

  scrollToTop() {
    window.scrollTo({ top: 0 });
  }
}
