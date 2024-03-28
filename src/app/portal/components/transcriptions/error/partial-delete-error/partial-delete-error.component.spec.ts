import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfigService } from '@services/app-config/app-config.service';
import { HeaderService } from '@services/header/header.service';
import { PartialDeleteErrorComponent } from './partial-delete-error.component';

describe('PartialDeleteErrorComponent', () => {
  let component: PartialDeleteErrorComponent;
  let fixture: ComponentFixture<PartialDeleteErrorComponent>;
  let mockHeaderService: Partial<HeaderService>;

  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };

  beforeEach(async () => {
    // convert mockHeaderService to jest instead of jasmine
    mockHeaderService = {
      hideNavigation: jest.fn(),
      showNavigation: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PartialDeleteErrorComponent],
      providers: [
        { provide: AppConfigService, useValue: appConfigServiceMock },
        { provide: HeaderService, useValue: mockHeaderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PartialDeleteErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call hideNavigation on ngOnInit', () => {
    component.ngOnInit();
    expect(mockHeaderService.hideNavigation).toHaveBeenCalled();
  });

  it('should call showNavigation on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockHeaderService.showNavigation).toHaveBeenCalled();
  });
});
