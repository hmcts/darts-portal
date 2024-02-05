import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { DevComponent } from './dev.component';

describe('DevComponent', () => {
  let component: DevComponent;
  let fixture: ComponentFixture<DevComponent>;

  const appConfigServiceMock = {
    getAppConfig: () => ({
      environment: 'development',
    }),
    isDevelopment: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevComponent],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
