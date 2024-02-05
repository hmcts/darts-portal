import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { HeaderService } from 'src/app/core/services/header/header.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden.component.html',
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
