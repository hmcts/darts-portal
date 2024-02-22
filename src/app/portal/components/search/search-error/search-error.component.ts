import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { AfterViewInit, Component, Input, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InternalErrorComponent } from '@components/error/internal-server/internal-error.component';
import { ErrorMessage } from '@core-types/error/error-message.interface';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-search-error',
  standalone: true,
  imports: [NgSwitchCase, NgSwitchDefault, NgSwitch, InternalErrorComponent, NgIf],
  templateUrl: './search-error.component.html',
  styleUrls: ['./search-error.component.scss'],
})
export class SearchErrorComponent implements AfterViewInit {
  @Input() error!: ErrorMessage | null;

  headerService = inject(HeaderService);
  router = inject(Router);
  private zone = inject(NgZone);

  ngAfterViewInit(): void {
    if (this.error?.display === 'PAGE' && this.error.status === 500) {
      this.zone.run(() => {
        this.router.navigateByUrl('internal-error');
      });
      setTimeout(() => this.headerService.hideNavigation(), 0);
    }
  }
}
