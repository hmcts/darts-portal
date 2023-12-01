import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fakeAuthService: Partial<AuthService>;
  let window: Window;

  beforeEach(() => {
    fakeAuthService = {
      getAuthenticated: jest.fn(),
    };

    window = {
      location: {
        href: '',
      },
    } as Window;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: 'Window', useValue: window },
      ],
      imports: [ReactiveFormsModule, LoginComponent],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#submit', () => {
    it('should change url to /auth/login if the user has selected an external option', () => {
      component.form.get('userType')?.setValue('external');
      component.submit();
      expect(window.location.href).toBe('/auth/login');
    });
    it('should change url to /auth/login if the user has selected an internal option', () => {
      component.form.get('userType')?.setValue('internal');
      component.submit();
      expect(window.location.href).toBe('/auth/internal/login');
    });
    it('should set errors flag to true if the user has not selected an option', () => {
      component.form.get('userType')?.setValue('');
      component.submit();
      expect(component.errors).toBe(true);
    });
  });
});
