import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollToElement(element: HTMLElement | null, notFoundText: string = `Element ${element} not found`) {
    setTimeout(() => {
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
        console.error(notFoundText);
      }
    }, 100);
  }

  scrollTo(selector: string) {
    this.scrollToElement(document.querySelector<HTMLElement>(selector), `Element with selector ${selector} not found`);
  }

  scrollToTop() {
    window.scrollTo({ top: 0 });
  }
}
