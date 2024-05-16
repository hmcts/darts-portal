import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [NgClass],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent implements OnInit, OnDestroy {
  @Input() numberOfItems = 0;
  @Input() title = '';
  @Input() deleteButtonTxt = 'Yes - delete';
  @Input() isRedDeleteButton = true;
  @Output() confirm = new EventEmitter();
  @Output() cancel = new EventEmitter();

  headerService = inject(HeaderService);

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => this.headerService.showNavigation(), 0);
  }
}
