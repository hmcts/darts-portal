import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { AdminNavigationComponent } from './admin-navigation.component';
import { FeatureFlagService } from '@services/app-config/feature-flag.service';

describe('AdminNavigationComponent', () => {
  let component: AdminNavigationComponent;
  let fixture: ComponentFixture<AdminNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavigationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: UserService, useValue: { isAdmin: jest.fn() } },
        { provide: FeatureFlagService, useValue: { isManualDeletionEnabled: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
