import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { InternalErrorComponent } from './internal-error.component';

describe('ErrorComponent', () => {
  let component: InternalErrorComponent;
  let fixture: ComponentFixture<InternalErrorComponent>;

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
      imports: [InternalErrorComponent],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceMock }],
    });
    fixture = TestBed.createComponent(InternalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
