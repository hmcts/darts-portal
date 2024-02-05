import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { AfterViewInit, Component, Input, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InternalErrorComponent } from 'src/app/core/components/error/internal-server/internal-error.component';
import { ErrorMessage } from 'src/app/core/models/error/error-message.interface';
import { HeaderService } from 'src/app/core/services/header/header.service';

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
