import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[unreadIcon]',
  standalone: true,
})
export class UnreadIconDirective {
  @Input('unreadIcon') icon!: string;
}
