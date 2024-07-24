import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollTo(selector: string) {
    setTimeout(() => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
        console.error(`Element with selector ${selector} not found`);
      }
    }, 100);
  }
}
