import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[unreadIcon]',
  standalone: true,
})
export class UnreadIconDirective {
  @Input('unreadIcon') icon!: string;
}
