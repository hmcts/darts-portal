import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesService } from '@services/cookies/cookies.service';
import { CookieBannerComponent } from './cookie-banner.component';

describe('CookieBannerComponent', () => {
  let component: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;
  let cookiesService: jest.Mocked<CookiesService>;

  beforeEach(async () => {
    cookiesService = {
      setCookiePolicy: jest.fn(),
    } as unknown as jest.Mocked<CookiesService>;

    await TestBed.configureTestingModule({
      imports: [CookieBannerComponent],
      providers: [{ provide: CookiesService, useValue: cookiesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CookieBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject cookies and update the cookie response', () => {
    component.rejectCookies();
    expect(component.cookieResponse).toBe('rejected');
    expect(cookiesService.setCookiePolicy).toHaveBeenCalledWith(false, false);
  });

  it('should accept cookies and update the cookie response', () => {
    component.acceptCookies();
    expect(component.cookieResponse).toBe('accepted');
    expect(cookiesService.setCookiePolicy).toHaveBeenCalledWith(true, true);
  });
});
