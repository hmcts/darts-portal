import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-internal-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internal-error.component.html',
  styleUrls: ['./internal-error.component.scss'],
})
export class InternalErrorComponent implements OnInit {
  headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
}
