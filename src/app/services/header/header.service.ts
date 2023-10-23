import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  readonly isVisible$: Observable<boolean> = this.isVisible.asObservable();

  showNavigation() {
    this.isVisible.next(true);
  }

  hideNavigation() {
    this.isVisible.next(false);
  }
}
