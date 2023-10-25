import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { AuthService } from '@services/auth/auth.service';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeAuthService: Partial<AuthService>;
  let fakeAudioService: Partial<AudioRequestService>;

  beforeEach(async () => {
    const fakeAppInsightsService = {};
    fakeAuthService = {
      getAuthenticated: jest.fn(() => true),
    };
    fakeAudioService = { unreadAudioCount$: of(5) };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent],
      providers: [
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: AudioRequestService, useValue: fakeAudioService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fakeAuthService.getAuthenticated).toHaveBeenCalled();
  });

  it('should set header count', () => {
    const unreadCountElement: HTMLSpanElement = fixture.debugElement.query(By.css('#notifications')).nativeElement;
    expect(unreadCountElement.textContent).toBe('5');
  });
});
