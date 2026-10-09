import { Component, Input, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AppConfigService } from '@services/app-config/app-config.service';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './forbidden.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent implements OnInit, OnDestroy {
  private appConfigService = inject(AppConfigService);
  support = this.appConfigService.getAppConfig()?.support;
  headerService = inject(HeaderService);

  @Input() header!: string;

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  ngOnDestroy(): void {
    this.headerService.showNavigation();
  }
}
