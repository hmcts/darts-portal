import { User } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserAdminService } from '@services/user-admin.service';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of } from 'rxjs/internal/observable/of';
import { CourthouseRecordComponent } from './courthouse-record.component';

describe('CourthouseRecordComponent', () => {
  let component: CourthouseRecordComponent;
  let fixture: ComponentFixture<CourthouseRecordComponent>;
  let fakeUserAdminService: Partial<UserAdminService>;
  let fakeActivatedRoute: ActivatedRoute;

  const TEST_USER: User = {
    id: 123,
    fullName: 'Test User',
    lastLoginAt: DateTime.fromISO('2021-01-01'),
    lastModifiedAt: DateTime.fromISO('2021-01-01'),
    createdAt: DateTime.fromISO('2021-01-01'),
    emailAddress: '',
    description: '',
    active: true,
    securityGroupIds: [],
  };

  const mockQueryParams = new BehaviorSubject<{ newUser: boolean }>({ newUser: false });

  beforeEach(async () => {
    fakeUserAdminService = {
      getUser: () => of(TEST_USER),
    };
    fakeActivatedRoute = {
      snapshot: {
        params: {
          userId: 123,
        },
      },
      queryParams: mockQueryParams.asObservable(),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [CourthouseRecordComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: UserAdminService, useValue: fakeUserAdminService },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourthouseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('render success banner when new user', () => {
    mockQueryParams.next({ newUser: true });

    fixture.detectChanges();

    const successBanner = fixture.debugElement.query(By.css('app-success-banner'));
    expect(successBanner).toBeTruthy();
  });

  it('does not render success banner when not new user', () => {
    mockQueryParams.next({ newUser: false });

    fixture.detectChanges();

    const successBanner = fixture.debugElement.query(By.css('app-success-banner'));
    expect(successBanner).toBeFalsy();
  });
});
