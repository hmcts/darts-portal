import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from '@services/app-config/app-config.service';

import { HeaderService } from '@services/header/header.service';
import { ForbiddenComponent } from './forbidden.component';

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForbiddenComponent],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceMock }],
    });
    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hide nav on init', () => {
    const headerService = TestBed.inject(HeaderService);
    const hideNavSpy = jest.spyOn(headerService, 'hideNavigation');
    component.ngOnInit();
    expect(hideNavSpy).toHaveBeenCalled();
  });

  it('show nav on destroy', () => {
    const headerService = TestBed.inject(HeaderService);
    const showNavSpy = jest.spyOn(headerService, 'showNavigation');
    component.ngOnDestroy();
    expect(showNavSpy).toHaveBeenCalled();
  });
});
