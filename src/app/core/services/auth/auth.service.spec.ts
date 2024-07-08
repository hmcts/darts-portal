import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService, IS_AUTH_PATH } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return true when authenticated', fakeAsync(() => {
    authService.checkIsAuthenticated().subscribe((result) => {
      expect(result).toBeTruthy();
      expect(authService.getAuthenticated()).toBeTruthy();
    });
    tick();
    const req = httpMock.expectOne((r) => r.url === `${IS_AUTH_PATH}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  }));

  it('should return false when not authenticated', fakeAsync(() => {
    authService.checkIsAuthenticated().subscribe((result) => {
      expect(result).toBeFalsy();
      expect(authService.getAuthenticated()).toBeFalsy();
    });
    tick();
    const req = httpMock.expectOne((r) => r.url === `${IS_AUTH_PATH}`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  }));
});
