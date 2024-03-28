import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-edit-email-confirmation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-email-confirmation.component.html',
  styleUrl: './edit-email-confirmation.component.scss',
})
export class EditEmailConfirmationComponent implements OnInit, OnDestroy {
  @Input() newEmail = '';
  @Input() oldEmail = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() errors = new EventEmitter<ErrorSummaryEntry[]>();

  headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
  ngOnDestroy(): void {
    this.headerService.showNavigation();
  }
}
