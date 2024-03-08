import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '@services/app-config/app-config.service';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-partial-delete-error',
  standalone: true,
  imports: [],
  templateUrl: './partial-delete-error.component.html',
  styleUrl: './partial-delete-error.component.scss',
})
export class PartialDeleteErrorComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);
  router = inject(Router);
  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
  ngOnDestroy(): void {
    this.headerService.showNavigation();
  }
}
