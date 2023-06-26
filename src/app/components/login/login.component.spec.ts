import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fakeAuthService: Partial<AuthService>;
  let window: Window;

  beforeEach(() => {
    fakeAuthService = {
      isAuthenticated: jasmine.createSpy().and.resolveTo(true),
    };

    window = {
      location: {
        href: '',
      },
    } as Window;

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: 'Window', useValue: window },
      ],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#submit', () => {
    it('should change url to /auth/login', () => {
      component.submit();
      expect(window.location.href).toBe('/auth/login');
    });
  });
});
