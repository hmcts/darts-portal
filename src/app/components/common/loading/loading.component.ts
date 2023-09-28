import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgClass],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() text = 'Loading...';
  @Input() size: 'small' | undefined;
}
